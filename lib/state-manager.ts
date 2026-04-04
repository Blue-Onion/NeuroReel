import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data", "production_runs");

export interface ProductionState {
  id: string;
  status: "idle" | "processing" | "completed" | "failed";
  progress: number;
  logs: Array<{
    timestamp: string;
    message: string;
    type: "info" | "success" | "warning" | "error" | "tool_call";
    meta?: any;
  }>;
  scenes: Array<{
    id: string;
    title: string;
    content: string;
    videoUrl?: string;
    status: "pending" | "processing" | "completed";
  }>;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function saveState(id: string, state: ProductionState): Promise<void> {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, `${id}.json`);
  state.updatedAt = new Date().toISOString();
  await fs.promises.writeFile(filePath, JSON.stringify(state, null, 2), "utf-8");
}

export async function getState(id: string): Promise<ProductionState | null> {
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(content);
}

export async function updateState(
  id: string,
  update: Partial<ProductionState> | ((prev: ProductionState) => ProductionState)
): Promise<ProductionState> {
  const currentState = await getState(id);
  if (!currentState) {
    throw new Error(`State for id ${id} not found`);
  }

  const newState = typeof update === "function" ? update(currentState) : { ...currentState, ...update };
  await saveState(id, newState);
  return newState;
}

export async function addLog(
  id: string,
  message: string,
  type: ProductionState["logs"][0]["type"] = "info",
  meta?: any
): Promise<void> {
  await updateState(id, (prev) => ({
    ...prev,
    logs: [
      ...prev.logs,
      {
        timestamp: new Date().toISOString(),
        message,
        type,
        meta,
      },
    ],
  }));
}

export async function initProductionRun(id: string): Promise<ProductionState> {
  const initialState: ProductionState = {
    id,
    status: "idle",
    progress: 0,
    logs: [
      {
        timestamp: new Date().toISOString(),
        message: "Production run initialized.",
        type: "success",
      },
    ],
    scenes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await saveState(id, initialState);
  return initialState;
}
