import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "./button";
import { format } from "date-fns";
import { SlCalender } from "react-icons/sl";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { Input } from "./input";
import { Label } from "./label";
import { useSelector } from "react-redux";

const AddCard = ({ column, setCards }) => {
  const [text, setText] = useState("");
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState("");
  const [assignee, setAssignee] = useState("");

  const assigneList = useSelector(
    (state) => state.project?.project?.project?.teams[0]?.users
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };
    console.log(newCard, assignee, priority, date);

    // setCards((pv) => [...pv, newCard]);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <motion.button
          layout
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-500"
        >
          <span>Add task</span>
          <FiPlus />
        </motion.button>
      </DialogTrigger>
      <DialogContent className="font-pops">
        <DialogHeader>
          <DialogTitle className="mb-4">Create Task</DialogTitle>
          <DialogDescription className="text-black flex flex-col gap-3">
            <Label htmlFor="title" className="font-md">
              Title
            </Label>
            <Input
              name="title"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Label htmlFor="assignee">Assignee</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Select assignee for task" />
              </SelectTrigger>
              <SelectContent className="font-pops">
                {assigneList?.map((al, i) => (
                  <SelectItem key={i} value={al.email}>
                    {al.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label htmlFor="calender">Due date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`
                    "justify-start text-left font-normal",
                    ${!date && "text-muted-foreground"}`}
                >
                  <SlCalender className="mr-2 size-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Medium" />
              </SelectTrigger>
              <SelectContent className="font-pops">
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSubmit}>Create Task</Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddCard;