import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface WaitlistEntry {
  id: string;
  name: string;
  phone: string;
  partySize: number;
  notes: string;
  status: "waiting" | "seated" | "cancelled" | "no-show";
  dateAdded: Date;
}

const WaitlistManagement = () => {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    name: '',
    phone: '',
    partySize: 1,
    notes: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    // Load waitlist data from local storage on component mount
    const storedWaitlist = localStorage.getItem('waitlist');
    if (storedWaitlist) {
      setWaitlist(JSON.parse(storedWaitlist).map((entry: any) => ({
        ...entry,
        dateAdded: new Date(entry.dateAdded),
      })));
    }
  }, []);

  useEffect(() => {
    // Save waitlist data to local storage whenever it changes
    localStorage.setItem('waitlist', JSON.stringify(waitlist));
  }, [waitlist]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleAddEntry = () => {
    if (!newEntry.name || !newEntry.phone) {
      toast.error('Name and phone are required.');
      return;
    }

    const newWaitlistEntry: WaitlistEntry = {
      id: Date.now().toString(),
      ...newEntry,
      partySize: parseInt(newEntry.partySize.toString(), 10),
      status: 'waiting',
      dateAdded: selectedDate || new Date(),
    };

    setWaitlist([...waitlist, newWaitlistEntry]);
    setNewEntry({ name: '', phone: '', partySize: 1, notes: '' });
    toast.success('Entry added to waitlist.');
  };

  const handleStatusChange = (id: string, status: WaitlistEntry['status']) => {
    setWaitlist(waitlist.map(entry =>
      entry.id === id ? { ...entry, status } : entry
    ));
  };

  const handleRemoveEntry = (id: string) => {
    setWaitlist(waitlist.filter(entry => entry.id !== id));
    toast.info('Entry removed from waitlist.');
  };

  const filteredWaitlist = waitlist.filter(entry => {
    const matchesSearch =
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.phone.toLowerCase().includes(searchQuery.toLowerCase());

    const entryDate = new Date(entry.dateAdded);
    const selected = selectedDate ? new Date(selectedDate) : null;

    const matchesDate = selected ?
      entryDate.getFullYear() === selected.getFullYear() &&
      entryDate.getMonth() === selected.getMonth() &&
      entryDate.getDate() === selected.getDate() : true;

    return matchesSearch && matchesDate;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Waitlist Management</h1>
        <p className="text-muted-foreground">Manage your restaurant's waitlist efficiently.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={newEntry.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={newEntry.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="partySize">Party Size</Label>
              <Input
                type="number"
                id="partySize"
                name="partySize"
                value={newEntry.partySize}
                onChange={handleInputChange}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={newEntry.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleAddEntry}>Add to Waitlist</Button>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              type="search"
              id="search"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-lg overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Current Waitlist</h2>
        {filteredWaitlist.length === 0 ? (
          <p className="text-muted-foreground">No entries found.</p>
        ) : (
          <Table>
            <TableCaption>A list of customers currently on the waitlist.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Party Size</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWaitlist.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  <TableCell>{entry.phone}</TableCell>
                  <TableCell>{entry.partySize}</TableCell>
                  <TableCell>{entry.dateAdded.toLocaleDateString()}</TableCell>
                  <TableCell>{entry.notes}</TableCell>
                  <TableCell>
                    <Select value={entry.status} onValueChange={(value) => handleStatusChange(entry.id, value as WaitlistEntry['status'])}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={entry.status} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="seated">Seated</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no-show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveEntry(entry.id)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default WaitlistManagement;
