
import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Users, Plus, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

// Mock data for tables
const tables = [
  { id: 1, name: "Table 1", capacity: 2, status: "available", section: "Main" },
  { id: 2, name: "Table 2", capacity: 4, status: "occupied", section: "Main" },
  { id: 3, name: "Table 3", capacity: 6, status: "reserved", section: "Main" },
  { id: 4, name: "Table 4", capacity: 2, status: "available", section: "Main" },
  { id: 5, name: "Table 5", capacity: 4, status: "occupied", section: "Patio" },
  { id: 6, name: "Table 6", capacity: 2, status: "available", section: "Patio" },
  { id: 7, name: "Table 7", capacity: 8, status: "reserved", section: "Private" },
  { id: 8, name: "Table 8", capacity: 4, status: "available", section: "Private" },
];

// Mock data for reservations
const reservations = [
  { 
    id: 1, 
    name: "John Smith", 
    phone: "+1 (555) 123-4567", 
    email: "john.smith@example.com",
    date: new Date("2023-06-15T18:30:00"), 
    guests: 4, 
    tableId: 2, 
    status: "confirmed", 
    notes: "Anniversary dinner" 
  },
  { 
    id: 2, 
    name: "Emily Johnson", 
    phone: "+1 (555) 987-6543", 
    email: "emily.johnson@example.com",
    date: new Date("2023-06-15T19:00:00"), 
    guests: 2, 
    tableId: 1, 
    status: "confirmed", 
    notes: "Window seat requested" 
  },
  { 
    id: 3, 
    name: "Michael Brown", 
    phone: "+1 (555) 456-7890", 
    email: "michael.brown@example.com",
    date: new Date("2023-06-15T20:15:00"), 
    guests: 6, 
    tableId: 3, 
    status: "pending", 
    notes: "Allergic to nuts" 
  },
  { 
    id: 4, 
    name: "Sophia Davis", 
    phone: "+1 (555) 234-5678", 
    email: "sophia.davis@example.com",
    date: new Date("2023-06-16T12:30:00"), 
    guests: 3, 
    tableId: 4, 
    status: "confirmed", 
    notes: "" 
  },
];

const TableManagement = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [section, setSection] = useState("all");
  const [isNewReservationOpen, setIsNewReservationOpen] = useState(false);
  
  // Filter tables based on section
  const filteredTables = section === "all" 
    ? tables 
    : tables.filter(table => table.section === section);
  
  // Filter reservations for today
  const todaysReservations = reservations.filter(res => 
    date && res.date.getDate() === date.getDate() && 
    res.date.getMonth() === date.getMonth() && 
    res.date.getFullYear() === date.getFullYear()
  );
  
  // Group reservations by time slot
  const reservationsByTime = todaysReservations.reduce((acc, res) => {
    const timeStr = format(res.date, "HH:mm");
    if (!acc[timeStr]) {
      acc[timeStr] = [];
    }
    acc[timeStr].push(res);
    return acc;
  }, {} as Record<string, typeof reservations>);
  
  // Sort time slots
  const sortedTimeSlots = Object.keys(reservationsByTime).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tables & Reservations</h1>
          <p className="text-muted-foreground">Manage tables and bookings</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-start text-left font-normal w-[240px]"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Dialog open={isNewReservationOpen} onOpenChange={setIsNewReservationOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Reservation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>New Reservation</DialogTitle>
                <DialogDescription>
                  Enter reservation details to create a new booking.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" placeholder="Guest name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input id="phone" placeholder="Phone number" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" placeholder="Email address" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start text-left font-normal w-full"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="time" className="text-right">
                    Time
                  </Label>
                  <Input id="time" type="time" defaultValue="19:00" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guests" className="text-right">
                    Guests
                  </Label>
                  <Input id="guests" type="number" min="1" defaultValue="2" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="table" className="text-right">
                    Table
                  </Label>
                  <select
                    id="table"
                    className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select a table</option>
                    {tables.map(table => (
                      <option key={table.id} value={table.id}>
                        {table.name} (Capacity: {table.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Input id="notes" placeholder="Special requests" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsNewReservationOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" onClick={() => setIsNewReservationOpen(false)}>
                  Create Reservation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="floor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="floor">Floor Plan</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
        </TabsList>
        
        {/* Floor Plan Tab */}
        <TabsContent value="floor" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant={section === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSection("all")}
              >
                All Sections
              </Button>
              <Button 
                variant={section === "Main" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSection("Main")}
              >
                Main Area
              </Button>
              <Button 
                variant={section === "Patio" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSection("Patio")}
              >
                Patio
              </Button>
              <Button 
                variant={section === "Private" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSection("Private")}
              >
                Private Room
              </Button>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span>Reserved</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTables.map((table) => (
              <Card key={table.id} className={cn(
                "cursor-pointer hover:shadow-md transition-shadow",
                table.status === "available" ? "border-green-500 bg-green-50 dark:bg-green-950/20" :
                table.status === "occupied" ? "border-red-500 bg-red-50 dark:bg-red-950/20" :
                "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
              )}>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{table.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Table</DropdownMenuItem>
                        <DropdownMenuItem>Create Reservation</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Available</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Occupied</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="flex items-center">
                    <Users className="h-3 w-3 mr-1" /> Capacity: {table.capacity}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-sm">
                    <span className="font-medium">Section:</span> {table.section}
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Status:</span> {' '}
                    <span className={cn(
                      "capitalize",
                      table.status === "available" ? "text-green-600" :
                      table.status === "occupied" ? "text-red-600" :
                      "text-yellow-600"
                    )}>
                      {table.status}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full">
                    {table.status === "available" ? "Seat Guests" :
                     table.status === "occupied" ? "View Bill" :
                     "View Reservation"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Reservations Tab */}
        <TabsContent value="reservations" className="space-y-4">
          <div className="bg-secondary/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Reservations for {date ? format(date, "PPPP") : "Today"}
            </h3>
            
            {sortedTimeSlots.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No reservations for this date.</p>
            ) : (
              <div className="space-y-6">
                {sortedTimeSlots.map((timeSlot) => (
                  <div key={timeSlot} className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {timeSlot}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {reservationsByTime[timeSlot].map((reservation) => (
                        <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-base">{reservation.name}</CardTitle>
                              <span className={cn(
                                "text-xs px-2 py-1 rounded-full",
                                reservation.status === "confirmed" ? "bg-green-100 text-green-800" :
                                "bg-yellow-100 text-yellow-800"
                              )}>
                                {reservation.status}
                              </span>
                            </div>
                            <CardDescription className="flex items-center">
                              <Users className="h-3 w-3 mr-1" /> 
                              {reservation.guests} guests • Table {tables.find(t => t.id === reservation.tableId)?.name}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="text-sm">{reservation.phone}</div>
                            <div className="text-sm">{reservation.email}</div>
                            {reservation.notes && (
                              <div className="text-sm mt-2">
                                <span className="font-medium">Notes:</span> {reservation.notes}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="p-4 pt-0 flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              Edit
                            </Button>
                            <Button size="sm" className="flex-1">
                              Seat Now
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Waitlist Tab */}
        <TabsContent value="waitlist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Waitlist</CardTitle>
              <CardDescription>Manage walk-in customers waiting for tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Smith Party</div>
                    <div className="text-sm text-muted-foreground">4 guests • 35 min wait</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      Text
                    </Button>
                    <Button size="sm">
                      Seat Now
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Johnson Party</div>
                    <div className="text-sm text-muted-foreground">2 guests • 15 min wait</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      Text
                    </Button>
                    <Button size="sm">
                      Seat Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add to Waitlist
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TableManagement;
