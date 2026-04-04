import { initProductionRun, updateState, addLog } from "../state-manager";
import { analyzeDocument, writeScript, generateVideoVeo } from "./sub-agents";

export async function runDirector(runId: string, rawText: string, options: { style?: string } = {}) {
  try {
    // 1. Initialize State
    await initProductionRun(runId);
    await updateState(runId, { status: "processing", progress: 5 });
    await addLog(runId, "Director Agent is starting the production engine...", "info");

    // 2. Stage 1: Document Analysis
    await updateState(runId, { progress: 10 });
    const summary = await analyzeDocument(runId, rawText);
    
    // 3. Stage 2: Scriptwriting
    await updateState(runId, { progress: 30 });
    const script = await writeScript(runId, summary, options.style);
    
    // 4. Stage 3: Video Generation for scenes
    const scenes = (await import("../state-manager")).getState(runId).then(s => s?.scenes || []);
    const currentScenes = await scenes;
    
    await addLog(runId, `Director delegating video production for ${currentScenes.length} scenes.`, "info");
    
    let completedCount = 0;
    for (const scene of currentScenes) {
      await updateState(runId, { progress: 30 + (completedCount / currentScenes.length) * 60 });
      
      const visualDescription = scene.content.split('\n').find(l => l.includes("Visual")) || scene.content;
      
      await generateVideoVeo(runId, scene.id, visualDescription);
      
      completedCount++;
    }

    // 5. Final Stage: Completion
    await updateState(runId, { status: "completed", progress: 100 });
    await addLog(runId, "Full cinematic production complete! You can now watch the video.", "success");

  } catch (error: any) {
    console.error("Director Run Failed:", error);
    await updateState(runId, { status: "failed", error: error.message });
    await addLog(runId, `Production halted: ${error.message}`, "error");
  }
}
