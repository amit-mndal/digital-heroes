"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Dashboard() {

  const [matchCount, setMatchCount] = useState(0);

  const [draw, setDraw] = useState("");
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);

  const [score, setScore] = useState("");
  const [scores, setScores] = useState<any[]>([]);

  const [charities, setCharities] = useState<any[]>([]);
  const [selectedCharity, setSelectedCharity] = useState("");
  const [percentage, setPercentage] = useState(10);

  // ✅ INIT (runs once safely)
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await new Promise((res) => setTimeout(res, 100)); // fix lock issue

      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      if (mounted) {
        setUserId(data.user.id);
        fetchScores(data.user.id);
        fetchCharities();
        fetchDraw();
      }
    };

    init();
    

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
  checkMatches();
}, [draw, scores]);

  // ✅ FETCH SCORES
  const fetchScores = async (uid: string) => {
    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", uid)
      .order("date", { ascending: false });

    setScores(data || []);
  };

  // ✅ FETCH CHARITIES
  const fetchCharities = async () => {
    const { data, error } = await supabase.from("charities").select("*");

    if (error) {
      console.log("Charity error:", error.message);
    }

    setCharities(data || []);
  };

  // ✅ ADD SCORE (5-limit + no duplicate date)
  const addScore = async () => {
    if (!userId) return;

    const { data: existing } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    const today = new Date().toISOString().split("T")[0];

    const alreadyExists = existing?.find(
      (s) => s.date.split("T")[0] === today
    );

    if (alreadyExists) {
      alert("Score already added for today!");
      return;
    }

    // delete oldest if 5
    if (existing && existing.length >= 5) {
      await supabase
        .from("scores")
        .delete()
        .eq("id", existing[0].id);
    }

    // insert new
    const { error } = await supabase.from("scores").insert({
      user_id: userId,
      score: Number(score),
      date: new Date().toISOString(),
    });

    if (error) {
      alert(error.message);
      return;
    }

    setScore("");
    fetchScores(userId);
  };

  // ✅ SAVE CHARITY
  const saveCharity = async () => {
    if (!userId) return;

    if (!selectedCharity) {
      alert("Please select a charity");
      return;
    }

    if (percentage < 10) {
      alert("Minimum 10% required");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        charity_id: selectedCharity,
        charity_percentage: percentage,
      })
      .eq("id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Charity saved!");
  };

const runDraw = async () => {
  const numbers: number[] = [];

  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) numbers.push(num);
  }

  const { error } = await supabase.from("draws").insert({
    numbers: numbers.join(","),
    created_at: new Date().toISOString(), // 🔥 FORCE FIX
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Draw generated!");

  await fetchDraw();
};

const handleLogout = async () => {
  await supabase.auth.signOut();
  router.push("/login");
};


  const fetchDraw = async () => {
  const { data } = await supabase
    .from("draws")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1);

  if (data && data.length > 0) {
    setDraw(data[0].numbers);
  }
 };



 const checkMatches = () => {
  if (!draw || scores.length === 0) return;

  const drawNumbers = draw.split(",").map(Number);
  const userScores = scores.map((s) => s.score);

  let count = 0;

  userScores.forEach((num) => {
    if (drawNumbers.includes(num)) {
      count++;
    }
  });

  setMatchCount(count);
 };





  return (

    <div className="min-h-screen flex items-center justify-center p-4">
  <div className="w-full max-w-xl bg-slate-800 text-white rounded-2xl shadow-xl p-6 space-y-6">

    <div className="flex justify-between items-center">
  <h1 className="text-xl font-bold">
    Dashboard
  </h1>

  <button
    onClick={handleLogout}
    className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
  >
    Logout
  </button>
</div>

    {/* SCORE SECTION */}
    <div className="bg-slate-700 p-4 rounded-xl">
      <h3 className="font-semibold mb-2">Add Score</h3>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 rounded text-black"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Enter score (1-45)"
        />
        <button
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          onClick={addScore}
        >
          Add
        </button>
      </div>

      <ul className="mt-3 space-y-1 text-sm">
        {scores.map((s) => (
          <li key={s.id}>
            {s.score} - {new Date(s.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>

    {/* CHARITY */}
    <div className="bg-slate-700 p-4 rounded-xl">
      <h3 className="font-semibold mb-2">Select Charity</h3>

      <select
        className="w-full p-2 rounded text-black"
        value={selectedCharity}
        onChange={(e) => setSelectedCharity(e.target.value)}
      >
        <option value="">Choose charity</option>
        {charities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        className="w-full mt-2 p-2 rounded text-black"
        type="number"
        value={percentage}
        onChange={(e) => setPercentage(Number(e.target.value))}
        placeholder="Percentage"
      />

      <button
        className="w-full mt-3 bg-green-500 py-2 rounded hover:bg-green-600"
        onClick={saveCharity}
      >
        Save Charity
      </button>
    </div>

    {/* DRAW */}
    <div className="bg-slate-700 p-4 rounded-xl text-center">
      <h3 className="font-semibold mb-2">Draw System</h3>

      <button
        className="bg-purple-500 px-4 py-2 rounded hover:bg-purple-600"
        onClick={runDraw}
      >
        Generate Draw
      </button>

      <p className="mt-3 text-lg font-semibold">{draw}</p>
    </div>

    {/* MATCH */}
    <div className="bg-slate-700 p-4 rounded-xl text-center">
      <h3 className="font-semibold mb-2">Match Result</h3>

      {matchCount === 5 && <p className="text-yellow-400">🏆 JACKPOT!</p>}
      {matchCount === 4 && <p>🎉 4 matches</p>}
      {matchCount === 3 && <p>👍 3 matches</p>}
      {matchCount < 3 && <p>{matchCount} matches</p>}
    </div>

  </div>
</div>
  );
}