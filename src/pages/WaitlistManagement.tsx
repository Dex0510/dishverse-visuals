
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { format, differenceInMinutes } from "date-fns";
import { 
  Clock, 
  Users, 
  Phone, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  BellRing,
  User,
  ClipboardList,
  TimerReset
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { WaitlistEntry, getMockWaitlist, getWaitTimeEstimate, WaitTimeEstimate } from "@/services/waitlistService";
import { Table as TableType, getTables, updateTableStatus } from "@/services/tableService";
import SmartTableMap from "@/components/SmartTableMap";

const WaitlistManagement = () => {
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [tables, setTables] = useState<TableType[]>([]);
  const [activeTab, setActiveTab] = useState("waitlist");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [isSeatDialogOpen, setIsSeatDialogOpen] = useState(false);
  const [waitTimeEstimates, setWaitTimeEstimates] = useState<Record<number, WaitTimeEstimate>>({});
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [selectedTable, setSelectedTable] = useState<string>("");
  
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    partySize: "2",
    notes: "",
    tablePreference: "",
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, use getWaitlist() instead of getMockWaitlist()
        const waitlistData = getMockWaitlist();
        setWaitlist(waitlistData);
        
        // Get tables
        const tablesData = await getTables();
        setTables(tablesData);
        
        // Get wait time estimates for various party sizes
        const partySizes = [1, 2, 4, 6, 8];
        const estimates: Record<number, WaitTimeEstimate> = {};
        
        for (const size of partySizes) {
          const estimate = await getWaitTimeEstimate(size);
          estimates[size] = estimate;
        }
        
        setWaitTimeEstimates(estimates);
      } catch (error) {
        console.error("Error loading waitlist data:", error);
        toast.error("Failed to load waitlist data");
      }
    };
    
    loadData();
  }, [refreshCounter]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add to waitlist
  const handleAddToWaitlist = () => {
    const newEntry: WaitlistEntry = {
      id: String(Date.now()),
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerEmail: formData.customerEmail || undefined,
      partySize: parseInt(formData.partySize),
      estimatedWaitTime: waitTimeEstimates[parseInt(formData.partySize)]?.estimatedMinutes || 20,
      status: 'waiting',
      notes: formData.notes || undefined,
      tablePreference: formData.tablePreference || undefined,
      createdAt: new Date().toISOString(),
      notified: false
    };
    
    setWaitlist([...waitlist, newEntry]);
    setIsAddDialogOpen(false);
    toast.success(`${formData.customerName} added to waitlist`);
    
    // Reset form
    setFormData({
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      partySize: "2",
      notes: "",
      tablePreference: "",
    });
  };

  // Notify customer
  const handleNotifyCustomer = () => {
    if (!selectedEntry) return;
    
    // Update entry status
    const updatedWaitlist = waitlist.map(entry => 
      entry.id === selectedEntry.id ? { ...entry, notified: true } : entry
    );
    
    setWaitlist(updatedWaitlist);
    setIsNotifyDialogOpen(false);
    
    toast.success(`${selectedEntry.customerName} has been notified that their table is ready`);
  };

  // Seat customer
  const handleSeatCustomer = async () => {
    if (!selectedEntry || !selectedTable) return;
    
    try {
      // Update table status
      await updateTableStatus(selectedTable, 'occupied');
      
      // Update waitlist entry
      const updatedWaitlist = waitlist.map(entry => 
        entry.id === selectedEntry.id ? { ...entry, status: 'seated' } : entry
      );
      
      setWaitlist(updatedWaitlist);
      setIsSeatDialogOpen(false);
      
      // Refresh tables
      setRefreshCounter(prev => prev + 1);
      
      toast.success(`${selectedEntry.customerName} has been seated at table ${selectedTable}`);
    } catch (error) {
      console.error("Error seating customer:", error);
      toast.error("Failed to update table status");
    }
  };

  // Cancel waitlist entry
  const handleCancelEntry = (entry: WaitlistEntry) => {
    const updatedWaitlist = waitlist.map(item => 
      item.id === entry.id ? { ...item, status: 'cancelled' } : item
    );
    
    setWaitlist(updatedWaitlist);
    toast.success(`${entry.customerName}'s waitlist entry has been cancelled`);
  };

  // Mark as no-show
  const handleMarkNoShow = (entry: WaitlistEntry) => {
    const updatedWaitlist = waitlist.map(item => 
      item.id === entry.id ? { ...item, status: 'no-show' } : item
    );
    
    setWaitlist(updatedWaitlist);
    toast.success(`${entry.customerName} marked as no-show`);
  };

  // Get active waitlist (status === 'waiting')
  const activeWaitlist = waitlist.filter(entry => entry.status === 'waiting');
  
  // Get wait time color based on minutes
  const getWaitTimeColor = (minutes: number) => {
    if (minutes <= 15) return "text-green-600";
    if (minutes <= 30) return "text-yellow-600";
    return "text-red-600";
  };

  // Format date
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };

  // Calculate elapsed time
  const getElapsedTime = (dateString: string) => {
    const minutes = differenceInMinutes(new Date(), new Date(dateString));
    
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    return `${hours}h ${remainingMinutes}m`;
  };

  // Get available tables for the party size
  const getAvailableTables = (partySize: number) => {
    return tables.filter(
      table => table.status === 'available' && table.capacity >= partySize
    );
  };

  // Calculate wait time stats
  const calculateWaitStats = () => {
    const waitingCount = activeWaitlist.length;
    
    if (waitingCount === 0) {
      return {
        averageWait: 0,
        longestWait: 0,
        totalParties: 0,
        totalGuests: 0
      };
    }
    
    let totalWaitTime = 0;
    let longestWait = 0;
    let totalGuests = 0;
    
    activeWaitlist.forEach(entry => {
      const waitTime = entry.estimatedWaitTime;
      totalWaitTime += waitTime;
      totalGuests += entry.partySize;
      
      if (waitTime > longestWait) {
        longestWait = waitTime;
      }
    });
    
    return {
      averageWait: Math.round(totalWaitTime / waitingCount),
      longestWait,
      totalParties: waitingCount,
      totalGuests
    };
  };
  
  const waitStats = calculateWaitStats();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Smart Table & Waitlist Management
            </h1>
            <p className="text-muted-foreground">
              Manage restaurant waitlist and table assignments
            </p>
          </div>

          <Button onClick={() => setIsAddDialogOpen(true)}>
            Add to Waitlist
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Waitlist Status</CardTitle>
              <CardDescription>Current waitlist metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <span>Parties Waiting</span>
                  </div>
                  <span className="font-medium">{waitStats.totalParties}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    <span>Total Guests</span>
                  </div>
                  <span className="font-medium">{waitStats.totalGuests}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <span>Average Wait</span>
                  </div>
                  <span className="font-medium">{waitStats.averageWait} min</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TimerReset className="h-4 w-4 mr-2 text-primary" />
                    <span>Longest Wait</span>
                  </div>
                  <span className={`font-medium ${getWaitTimeColor(waitStats.longestWait)}`}>
                    {waitStats.longestWait} min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Current Wait Times</CardTitle>
              <CardDescription>Estimated wait by party size</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[2, 4, 6, 8].map(size => {
                  const estimate = waitTimeEstimates[size];
                  if (!estimate) return null;
                  
                  return (
                    <div key={size} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Party of {size}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`font-medium ${getWaitTimeColor(estimate.estimatedMinutes)}`}>
                          {estimate.estimatedMinutes} min
                        </span>
                        {estimate.confidence !== 'high' && (
                          <span className="ml-1 text-xs text-muted-foreground">
                            ({estimate.confidence})
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Table Availability</CardTitle>
              <CardDescription>Current table status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['available', 'occupied', 'reserved', 'cleaning'].map(status => {
                  const tablesWithStatus = tables.filter(table => table.status === status);
                  
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${
                          status === 'available' ? 'bg-green-500' :
                          status === 'occupied' ? 'bg-red-500' :
                          status === 'reserved' ? 'bg-amber-500' :
                          'bg-blue-500'
                        }`} />
                        <span className="capitalize">{status}</span>
                      </div>
                      <span className="font-medium">{tablesWithStatus.length}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="waitlist">
              <ClipboardList className="h-4 w-4 mr-2" />
              Waitlist
            </TabsTrigger>
            <TabsTrigger value="tables">
              <Users className="h-4 w-4 mr-2" />
              Table Map
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="waitlist" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Waitlist</CardTitle>
                <CardDescription>Customers currently waiting for a table</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Party Size</TableHead>
                      <TableHead>Added At</TableHead>
                      <TableHead>Wait Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeWaitlist.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No customers currently waiting
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeWaitlist.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            {entry.customerName}
                            {entry.tablePreference && (
                              <div className="text-xs text-muted-foreground">
                                Prefers: {entry.tablePreference}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                              {entry.partySize}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{formatTime(entry.createdAt)}</span>
                              <span className="text-xs text-muted-foreground">
                                {getElapsedTime(entry.createdAt)} ago
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={getWaitTimeColor(entry.estimatedWaitTime)}>
                              {entry.estimatedWaitTime} min
                            </span>
                          </TableCell>
                          <TableCell>
                            {entry.notified ? (
                              <div className="flex items-center text-amber-600">
                                <BellRing className="h-4 w-4 mr-1" />
                                <span>Notified</span>
                              </div>
                            ) : (
                              <span className="text-green-600">Waiting</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col text-xs">
                              <div className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {entry.customerPhone}
                              </div>
                              {entry.customerEmail && (
                                <div className="flex items-center mt-1">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {entry.customerEmail}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Manage</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedEntry(entry);
                                    setIsSeatDialogOpen(true);
                                  }}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Seat Now
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedEntry(entry);
                                    setIsNotifyDialogOpen(true);
                                  }}
                                  disabled={entry.notified}
                                >
                                  <BellRing className="h-4 w-4 mr-2" />
                                  Notify Customer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleCancelEntry(entry)}
                                  className="text-yellow-600"
                                >
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  Cancel
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleMarkNoShow(entry)}
                                  className="text-red-600"
                                >
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  Mark as No-show
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle>Recent History</CardTitle>
                <CardDescription>Recently seated or cancelled entries</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Party Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Wait Duration</TableHead>
                      <TableHead className="text-right">Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {waitlist.filter(entry => entry.status !== 'waiting').length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No recent entries
                        </TableCell>
                      </TableRow>
                    ) : (
                      waitlist
                        .filter(entry => entry.status !== 'waiting')
                        .slice(0, 5)
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">{entry.customerName}</TableCell>
                            <TableCell>{entry.partySize}</TableCell>
                            <TableCell>
                              <span className={
                                entry.status === 'seated' ? 'text-green-600' :
                                entry.status === 'cancelled' ? 'text-yellow-600' : 'text-red-600'
                              }>
                                {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>{getElapsedTime(entry.createdAt)}</TableCell>
                            <TableCell className="text-right">{entry.customerPhone}</TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tables" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Smart Table Map</CardTitle>
                <CardDescription>Visual restaurant layout with real-time table status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-4 bg-slate-50 min-h-[400px]">
                  <SmartTableMap tables={tables} activeWaitlist={activeWaitlist} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add to Waitlist Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add to Waitlist</DialogTitle>
            <DialogDescription>
              Enter customer information to add them to the waitlist.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right" htmlFor="customerName">
                Customer Name
              </label>
              <Input
                id="customerName"
                name="customerName"
                className="col-span-3"
                value={formData.customerName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right" htmlFor="customerPhone">
                Phone Number
              </label>
              <Input
                id="customerPhone"
                name="customerPhone"
                className="col-span-3"
                value={formData.customerPhone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right" htmlFor="customerEmail">
                Email (Optional)
              </label>
              <Input
                id="customerEmail"
                name="customerEmail"
                className="col-span-3"
                value={formData.customerEmail}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right" htmlFor="partySize">
                Party Size
              </label>
              <Select
                value={formData.partySize}
                onValueChange={(value) => handleSelectChange("partySize", value)}
              >
                <SelectTrigger id="partySize-select" className="col-span-3">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'guest' : 'guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right" htmlFor="tablePreference">
                Table Preference
              </label>
              <Select
                value={formData.tablePreference}
                onValueChange={(value) => handleSelectChange("tablePreference", value)}
              >
                <SelectTrigger id="tablePreference-select" className="col-span-3">
                  <SelectValue placeholder="Any table" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No preference</SelectItem>
                  <SelectItem value="Window">Window</SelectItem>
                  <SelectItem value="Booth">Booth</SelectItem>
                  <SelectItem value="Bar">Bar</SelectItem>
                  <SelectItem value="Patio">Patio</SelectItem>
                  <SelectItem value="Private Room">Private Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right" htmlFor="notes">
                Notes
              </label>
              <Textarea
                id="notes"
                name="notes"
                className="col-span-3"
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddToWaitlist}>Add to Waitlist</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notify Customer Dialog */}
      <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Notify Customer</DialogTitle>
            <DialogDescription>
              Send notification to customer that their table is ready.
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="py-4">
              <div className="mb-4">
                <p className="font-medium">{selectedEntry.customerName}</p>
                <p className="text-sm text-muted-foreground">Party of {selectedEntry.partySize}</p>
                <p className="text-sm text-muted-foreground">{selectedEntry.customerPhone}</p>
                {selectedEntry.customerEmail && (
                  <p className="text-sm text-muted-foreground">{selectedEntry.customerEmail}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Notification methods:</p>
                <div className="flex items-center space-x-2">
                  <Button className="flex items-center">
                    <Phone className="mr-2 h-4 w-4" />
                    Send SMS
                  </Button>
                  {selectedEntry.customerEmail && (
                    <Button variant="outline" className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Email
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleNotifyCustomer}>Notify Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Seat Customer Dialog */}
      <Dialog open={isSeatDialogOpen} onOpenChange={setIsSeatDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Seat Customer</DialogTitle>
            <DialogDescription>
              Assign a table to the customer and mark them as seated.
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="py-4">
              <div className="mb-4">
                <p className="font-medium">{selectedEntry.customerName}</p>
                <p className="text-sm text-muted-foreground">Party of {selectedEntry.partySize}</p>
                {selectedEntry.tablePreference && (
                  <p className="text-sm text-muted-foreground">
                    Prefers: {selectedEntry.tablePreference}
                  </p>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right font-medium" htmlFor="tableSelect">
                    Select Table
                  </label>
                  <Select
                    value={selectedTable}
                    onValueChange={setSelectedTable}
                  >
                    <SelectTrigger id="tableSelect" className="col-span-3">
                      <SelectValue placeholder="Choose a table" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTables(selectedEntry.partySize).length === 0 ? (
                        <SelectItem value="" disabled>
                          No suitable tables available
                        </SelectItem>
                      ) : (
                        getAvailableTables(selectedEntry.partySize).map((table) => (
                          <SelectItem key={table.id} value={table.id}>
                            {table.name} (Capacity: {table.capacity})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedEntry.tablePreference && 
                 getAvailableTables(selectedEntry.partySize).some(t => t.section.toLowerCase().includes(selectedEntry.tablePreference!.toLowerCase())) && (
                  <div className="bg-yellow-50 p-3 rounded-md text-sm border border-yellow-200">
                    <p className="flex items-center text-yellow-800">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Customer prefers {selectedEntry.tablePreference} seating.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSeatDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSeatCustomer} 
              disabled={!selectedTable || getAvailableTables(selectedEntry?.partySize || 0).length === 0}
            >
              Seat Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default WaitlistManagement;
