"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {createAdminClient} from "@/utils/supabase/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreatePollForm() {
  const supabase = createAdminClient(); // Admin client with service role
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);

  const addOption = () => setOptions([...options, ""]);

  const handleSubmit = async () => {
    setLoading(true);

    // 1️⃣ Insert poll
    const { data: poll, error } = await supabase
      .from("polls")
      .insert({
        title,
        description,
        is_active: true, // Admin polls are active immediately
      })
      .select()
      .single();

    if (error || !poll) {
      alert(error?.message || "Failed to create poll");
      setLoading(false);
      return;
    }

    // 2️⃣ Insert poll options
    const optionRows = options.map((text) => ({
      poll_id: poll.id,
      option_text: text,
    }));

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionRows);

    if (optionsError) {
      alert(optionsError.message);
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
