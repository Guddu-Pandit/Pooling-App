"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreatePollForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  const addOption = () => setOptions([...options, ""]);

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/polls/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, options }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to create poll");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <div className="max-w-xl mx-auto rounded-2xl border bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Create a new poll
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Add a question and multiple options for users to vote.
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Poll Title
        </label>
        <Input
          placeholder="e.g. Best programming language?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Description (optional)
        </label>
        <Input
          placeholder="Short description about the poll"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">
          Poll Options
        </label>

        {options.map((opt, i) => (
          <Input
            key={i}
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => {
              const copy = [...options];
              copy[i] = e.target.value;
              setOptions(copy);
            }}
          />
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={addOption}
          className="w-fit"
        >
           Add option +
        </Button>
      </div>

      {/* Action */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full rounded-xl py-6 text-base"
      >
        {loading ? "Creating..." : "Create Poll"}
      </Button>
    </div>
  );
}
