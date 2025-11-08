"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is NeuroReel?",
    answer:
      "NeuroReel is an AI-powered platform that transforms static training materials into dynamic, story-driven video experiences tailored for every employee.",
  },
  {
    question: "Do I need coding skills to use NeuroReel?",
    answer:
      "Not at all! NeuroReel is completely no-code. Just upload your content and let the AI handle everything—from scripting to video generation.",
  },
  {
    question: "Can I integrate NeuroReel with my company’s LMS?",
    answer:
      "Yes, NeuroReel seamlessly integrates with popular LMS platforms like Workday, Slack, and Microsoft Teams for smooth onboarding and tracking.",
  },
  {
    question: "How is learning performance tracked?",
    answer:
      "You get a detailed analytics dashboard that measures engagement, knowledge retention, and behavioral impact to show real ROI on learning.",
  },
  {
    question: "Is the content secure?",
    answer:
      "Absolutely. All content is encrypted and stored securely following enterprise-grade data protection standards.",
  },
];

export default function Faqs() {
  return (
    <section className="min-h-screen py-24 bg-gradient-to-b from-white to-blue-50 flex items-center">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto ">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
