import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/types/supabase";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  SearchIcon,
  ArrowRightIcon,
  LoaderCircleIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Examination = Tables<"examinations">;
type Result = Tables<"results">;

export default function ResultsApp() {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [rollNumber, setRollNumber] = useState<string>("");
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    fetchExaminations();
  }, []);

  const fetchExaminations = async () => {
    try {
      const { data, error } = await supabase
        .from("examinations")
        .select("*")
        .order("year", { ascending: false });

      if (error) throw error;
      setExaminations(data || []);
    } catch (error: any) {
      console.error("Error fetching examinations:", error.message);
      setError("Failed to load examinations. Please try again.");
    }
  };

  const handleSearch = async () => {
    if (!selectedExam || !rollNumber || !dob) {
      setError("Please fill all fields");
      return;
    }

    setError(null);
    setLoading(true);
    setIsSearching(true);

    try {
      const formattedDob = format(dob, "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("results")
        .select("*")
        .eq("examination_id", selectedExam)
        .eq("roll_no", rollNumber)
        .eq("dob", formattedDob)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setError("No results found for the provided details");
        } else {
          throw error;
        }
      }

      setResult(data);
    } catch (error: any) {
      console.error("Error fetching result:", error.message);
      setError("An error occurred while fetching your result");
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setIsSearching(false);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900">
          Examination Results
        </h1>

        {!isSearching || !result ? (
          <Card className="p-6 shadow-sm bg-white rounded-xl border-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Select Examination
                </label>
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger className="w-full rounded-lg border-gray-200 h-11">
                    <SelectValue placeholder="Select examination" />
                  </SelectTrigger>
                  <SelectContent>
                    {examinations.map((exam) => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.name} ({exam.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Roll Number
                </label>
                <Input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter your roll number"
                  className="rounded-lg border-gray-200 h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Date of Birth
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    placeholder="DD"
                    min="1"
                    max="31"
                    className="rounded-lg border-gray-200 h-11"
                    value={dob ? new Date(dob).getDate() : ""}
                    onChange={(e) => {
                      const day = parseInt(e.target.value);
                      if (isNaN(day) || day < 1 || day > 31) return;
                      const newDate = dob ? new Date(dob) : new Date();
                      newDate.setDate(day);
                      setDob(newDate);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="MM"
                    min="1"
                    max="12"
                    className="rounded-lg border-gray-200 h-11"
                    value={dob ? new Date(dob).getMonth() + 1 : ""}
                    onChange={(e) => {
                      const month = parseInt(e.target.value);
                      if (isNaN(month) || month < 1 || month > 12) return;
                      const newDate = dob ? new Date(dob) : new Date();
                      newDate.setMonth(month - 1);
                      setDob(newDate);
                    }}
                  />
                  <Input
                    type="number"
                    placeholder="YYYY"
                    min="1900"
                    max="2100"
                    className="rounded-lg border-gray-200 h-11"
                    value={dob ? new Date(dob).getFullYear() : ""}
                    onChange={(e) => {
                      const year = parseInt(e.target.value);
                      if (isNaN(year) || year < 1900 || year > 2100) return;
                      const newDate = dob ? new Date(dob) : new Date();
                      newDate.setFullYear(year);
                      setDob(newDate);
                    }}
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-500 mt-2">{error}</div>
              )}

              <Button
                onClick={handleSearch}
                disabled={loading || !selectedExam || !rollNumber || !dob}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg h-11 mt-2"
              >
                {loading ? (
                  <LoaderCircleIcon className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <SearchIcon className="h-4 w-4 mr-2" />
                )}
                Find Results
              </Button>
            </div>
          </Card>
        ) : result ? (
          <Card className="p-6 shadow-sm bg-white rounded-xl border-0">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-medium text-gray-900">
                  Result Details
                </h2>
                <Button
                  variant="ghost"
                  onClick={resetSearch}
                  className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                >
                  Search Again
                </Button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Roll Number</p>
                      <p className="font-medium">{result.roll_no}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {format(new Date(result.dob), "PP")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Marks Obtained</span>
                    <span className="text-lg font-semibold">
                      {result.marks}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Result</span>
                    <span
                      className={`font-medium ${result.result === "Pass" ? "text-green-600" : "text-red-600"}`}
                    >
                      {result.result}
                    </span>
                  </div>

                  {result.division && (
                    <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                      <span className="text-gray-600">Division</span>
                      <span className="font-medium">{result.division}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-center">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-full ${result.result === "Pass" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {result.result === "Pass"
                      ? "Congratulations!"
                      : "Better luck next time"}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
