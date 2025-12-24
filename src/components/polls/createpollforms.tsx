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
    router.refresh(); // reload admin polls table
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Poll title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

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

      <Button variant="outline" onClick={addOption}>
        + Add option
      </Button>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Poll"}
      </Button>
    </div>
  );
}
