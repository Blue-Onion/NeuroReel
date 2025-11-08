"use client";

import Faqs from "@/components/Faqs";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
const faqs=[
  {
    "question": "What is Neuroflix?",
    "answer": "Neuroflix is an AI-powered platform that transforms static training materials into dynamic, story-driven video experiences tailored for every employee."
  },
  {
    "question": "Do I need coding skills to use Neuroflix?",
    "answer": "Not at all! Neuroflix is completely no-code. Just upload your content and let the AI handle everything—from scripting to video generation."
  },
  {
    "question": "Can I integrate Neuroflix with my company’s LMS?",
    "answer": "Yes, Neuroflix seamlessly integrates with popular LMS platforms like Workday, Slack, and Microsoft Teams for smooth onboarding and tracking."
  },
  {
    "question": "How is learning performance tracked?",
    "answer": "You get a detailed analytics dashboard that measures engagement, knowledge retention, and behavioral impact to show real ROI on learning."
  },
  {
    "question": "Is the content secure?",
    "answer": "Absolutely. All content is encrypted and stored securely following enterprise-grade data protection standards."
  }
]

const feat = [
  
  {
    title: "Upload & Transform",
    subtitle: "Turn static content into dynamic stories.",
    description:
      "Upload PDFs, manuals, or playbooks, and Neuroflix instantly converts them into interactive, cinematic training videos powered by AI.",
  },
  {
    title: "Personalized Protagonists",
    subtitle: "Your team, your heroes.",
    description:
      "Generate personalized avatars from employee headshots—making every learning experience relatable and engaging.",
  },
  {
    title: "Adaptive Episodes",
    subtitle: "Training that learns from you.",
    description:
      "AI tracks engagement and performance to reshape each video episode, ensuring knowledge sticks through emotion and repetition.",
  },
  {
    title: "Interactive Learning",
    subtitle: "Watch, choose, and play.",
    description:
      "Bite-sized 3–5 minute video modules with branching narratives and gamified quizzes that keep learners hooked.",
  },
  {
    title: "Analytics Dashboard",
    subtitle: "Measure impact, not just attendance.",
    description:
      "Track completion rates, engagement scores, and skill growth through a sleek, data-rich dashboard.",
  },
  {
    title: "Seamless Integration",
    subtitle: "Plug into your workflow.",
    description:
      "Embed training directly into platforms like Slack or Workday with zero setup—learning where your team already works.",
  },
];

export default function Home(): JSX.Element {
  const [text, setText] = useState("");
  const sentences = [
    "Ready to convert your boring document into a story?",
    "Transform dull PDFs into binge-worthy learning adventures.",
    "Let your team learn, laugh, and remember — effortlessly.",
  ];

  useEffect(() => {
    let i = 0;
    let j = 0;
    let currentSentence = sentences[i];
    let isDeleting = false;

    const typing = setInterval(() => {
      if (!isDeleting) {
        setText(currentSentence.slice(0, j + 1));
        j++;

        if (j === currentSentence.length) {
          isDeleting = true;
          setTimeout(() => {}, 1000);
        }
      } else {
        setText(currentSentence.slice(0, j - 1));
        j--;

        if (j === 0) {
          isDeleting = false;
          i = (i + 1) % sentences.length;
          currentSentence = sentences[i];
        }
      }
    }, 80);

    return () => clearInterval(typing);
  }, []);

  return (
    <main className="space-y-6">
      {/* Hero Section */}
      <section className="min-h-screen flex justify-center items-center bg-gradient-to-b from-blue-300 via-gray-200 to-red-400">
        <div className="mx-auto flex flex-col items-center justify-center container space-y-8">
          <div className="flex flex-col items-center justify-center gap-5">
            <h1 className="text-6xl max-w-3xl gradient-title text-center">
              Turn training into unforgettable stories.
            </h1>
            <p className="text-muted-foreground text-center max-w-4xl">
              Neuroflix turns dry, forgettable lessons into cinematic, AI-driven
              learning journeys that captivate attention and make knowledge
              unforgettable.
            </p>
          </div>

          {/* Typewriter Input Box */}
          <div className="relative w-full max-w-2xl">
            <input
              type="text"
              readOnly
              value={text}
              className="w-full h-16 rounded-3xl text-muted-foreground border-2 border-gray-300 bg-white px-6 text-lg shadow-lg focus:outline-none placeholder-gray-400 transition-all duration-300"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 animate-pulse text-gray-400 text-2xl">
              <Paperclip />
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-b from-white via-gray-50 to-gray-100">
        <div className="mx-auto container flex flex-col items-center justify-start space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold gradient-title">
              Imagine it. Neuroflix builds it.
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From static PDFs to cinematic learning—upload, personalize, and
              watch your content come alive.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {feat.map((f, index) => (
              <Card
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <CardTitle>

                <h3 className="text-xl font-semibold mb-2 text-blue-700 group-hover:text-blue-800 transition-colors">
                  {f.title}
                </h3>
                </CardTitle>
                <CardDescription>

                <p className="text-gray-600 font-medium mb-2">
                  {f.subtitle}
                </p>
                </CardDescription>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section>
        <Faqs/>
      </section>
    </main>
  );
}
