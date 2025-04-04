
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  Circle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { debugLog } from "@/utils/debugHelpers";

// Mock data for tables
const initialTables = [
  {
    id: "1",
    number: "1",
    capacity: 4,
    status: "available",
    location: "Main Floor",
    lastUpdated: "2023-06-10T14:30:00",
  },
  {
    id: "2",
    number: "2",
    capacity: 2,
    status: "occupied",
    location: "Main Floor",
    lastUpdated: "2023-06-10T12:15:00",
  },
  {
    id: "3",
    number: "3",
    capacity: 6,
    status: "reserved",
    location: "Patio",
    lastUpdated: "2023-06-10T13:45:00",
  },
  {
    id: "4",
    number: "4",
    capacity: 8,
    status: "available",
    location: "Private Room",
    lastUpdated: "2023-06-10T11:00:00",
  },
  {
    id: "5",
    number: "5",
    capacity: 4,
    status: "maintenance",
    location: "Main Floor",
    lastUpdated: "2023-06-09T16:20:00",
  },
];

// Table locations
const tableLocations = ["Main Floor", "Patio", "Private Room", "Bar", "Lounge"];

// Table statuses with colors
const tableStatuses = [
  { value: "available", label: "Available", color: "text-green-500" },
  { value: "occupied", label: "Occupied", color: "text-red-500" },
  { value: "reserved", label: "Reserved", color: "text-amber-500" },
  { value: "maintenance", label: "Maintenance", color: "text-slate-500" },
];

const TableManagement = () => {
  const [tables, setTables] = useState(initialTables);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    number: "",
    capacity: "4",
    status: "available",
    location: "Main Floor",
  });
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Reset form when dialog closes
  useEffect(() => {
    if (!isAddDialogOpen && !isEditDialogOpen) {
      setFormData({
        number: "",
        capacity: "4",
        status: "available",
        location: "Main Floor",
      });
      setSelectedTableId(null);
    }
  }, [isAddDialogOpen, isEditDialogOpen]);

  // Load selected table data for editing
  useEffect(() => {
    if (selectedTableId && isEditDialogOpen) {
      const tableToEdit = tables.find((table) => table.id === selectedTableId);
      if (tableToEdit) {
        setFormData({
          number: tableToEdit.number,
          capacity: tableToEdit.capacity.toString(),
          status: tableToEdit.status,
          location: tableToEdit.location,
        });
      }
    }
  }, [selectedTableId, isEditDialogOpen, tables]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

  // Add new table
  const handleAddTable = () => {
    const newTable = {
      id: Date.now().toString(),
      number: formData.number,
      capacity: parseInt(formData.capacity),
      status: formData.status,
      location: formData.location,
      lastUpdated: new Date().toISOString(),
    };

    setTables([...tables, newTable]);
    setIsAddDialogOpen(false);
    toast.success(`Table ${formData.number} added successfully`);
  };

  // Update existing table
  const handleUpdateTable = () => {
    if (!selectedTableId) return;

    const updatedTables = tables.map((table) =>
      table.id === selectedTableId
        ? {
            ...table,
            number: formData.number,
            capacity: parseInt(formData.capacity),
            status: formData.status,
            location: formData.location,
            lastUpdated: new Date().toISOString(),
          }
        : table
    );

    setTables(updatedTables);
    setIsEditDialogOpen(false);
    toast.success(`Table ${formData.number} updated successfully`);
  };

  // Delete table
  const handleDeleteTable = () => {
    if (!selectedTableId) return;

    const tableToDelete = tables.find((table) => table.id === selectedTableId);
    const updatedTables = tables.filter((table) => table.id !== selectedTableId);

    setTables(updatedTables);
    setIsDeleteDialogOpen(false);
    toast.success(
      `Table ${tableToDelete ? tableToDelete.number : ""} deleted successfully`
    );
  };

  // Quick update table status
  const handleQuickStatusUpdate = (tableId: string, newStatus: string) => {
    const updatedTables = tables.map((table) =>
      table.id === tableId
        ? {
            ...table,
            status: newStatus,
            lastUpdated: new Date().toISOString(),
          }
        : table
    );

    setTables(updatedTables);
    const tableNumber = tables.find((table) => table.id === tableId)?.number;
    toast.success(
      `Table ${tableNumber} status updated to ${
        tableStatuses.find((status) => status.value === newStatus)?.label
      }`
    );
  };

  // Filter tables based on status, location, and search query
  const filteredTables = tables.filter((table) => {
    const matchesStatus =
      filterStatus === "all" || table.status === filterStatus;
    const matchesLocation =
      filterLocation === "all" || table.location === filterLocation;
    const matchesSearch =
      table.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesLocation && matchesSearch;
  });

  // Get status color and icon
  const getStatusInfo = (status: string) => {
    const statusInfo = tableStatuses.find((s) => s.value === status);
    let icon;

    switch (status) {
      case "available":
        icon = <CheckCircle2 className="h-4 w-4 text-green-500" />;
        break;
      case "occupied":
        icon = <XCircle className="h-4 w-4 text-red-500" />;
        break;
      case "reserved":
        icon = <Clock className="h-4 w-4 text-amber-500" />;
        break;
      default:
        icon = <Circle className="h-4 w-4 text-slate-500" />;
    }

    return {
      color: statusInfo?.color || "text-slate-500",
      icon,
      label: statusInfo?.label || "Unknown",
    };
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Table Management
            </h1>
            <p className="text-muted-foreground">
              Manage restaurant tables and their status
            </p>
          </div>

          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Table
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Card className="w-full sm:w-1/3">
            <CardHeader className="pb-3">
              <CardTitle>Table Status Overview</CardTitle>
              <CardDescription>Current table availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tableStatuses.map((status) => {
                  const count = tables.filter(
                    (table) => table.status === status.value
                  ).length;
                  return (
                    <div
                      key={status.value}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${
                            status.value === "available"
                              ? "bg-green-500"
                              : status.value === "occupied"
                              ? "bg-red-500"
                              : status.value === "reserved"
                              ? "bg-amber-500"
                              : "bg-slate-500"
                          }`}
                        />
                        <span>{status.label}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{count}</span>
                        <span className="text-muted-foreground ml-1">
                          tables
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full sm:w-2/3">
            <CardHeader className="pb-3">
              <CardTitle>Table Capacity</CardTitle>
              <CardDescription>
                Distribution of tables by seating capacity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[2, 4, 6, 8].map((capacity) => {
                  const tablesWithCapacity = tables.filter(
                    (table) => table.capacity === capacity
                  );
                  const count = tablesWithCapacity.length;
                  const availableCount = tablesWithCapacity.filter(
                    (table) => table.status === "available"
                  ).length;

                  return (
                    <div key={capacity} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{capacity} Seats</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{availableCount}</span>
                          <span className="text-muted-foreground">
                            /{count} available
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${
                              count > 0 ? (availableCount / count) * 100 : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Tables</CardTitle>
            <CardDescription>
              View and manage all restaurant tables
            </CardDescription>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-1">
                <Input
                  placeholder="Search tables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                >
                  <SelectTrigger id="status-filter-trigger">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {tableStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterLocation}
                  onValueChange={setFilterLocation}
                >
                  <SelectTrigger id="location-filter-trigger">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {tableLocations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table #</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTables.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center h-24 text-muted-foreground"
                    >
                      No tables found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTables.map((table) => {
                    const statusInfo = getStatusInfo(table.status);
                    return (
                      <TableRow key={table.id}>
                        <TableCell className="font-medium">
                          {table.number}
                        </TableCell>
                        <TableCell>{table.capacity}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {statusInfo.icon}
                            <span className={`ml-2 ${statusInfo.color}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{table.location}</TableCell>
                        <TableCell>
                          {formatDate(table.lastUpdated)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTableId(table.id);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Table
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTableId(table.id);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Table
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>
                                Change Status
                              </DropdownMenuLabel>
                              {tableStatuses.map((status) => (
                                <DropdownMenuItem
                                  key={status.value}
                                  disabled={table.status === status.value}
                                  onClick={() =>
                                    handleQuickStatusUpdate(
                                      table.id,
                                      status.value
                                    )
                                  }
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full mr-2 ${
                                      status.value === "available"
                                        ? "bg-green-500"
                                        : status.value === "occupied"
                                        ? "bg-red-500"
                                        : status.value === "reserved"
                                        ? "bg-amber-500"
                                        : "bg-slate-500"
                                    }`}
                                  />
                                  {status.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Table Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Table</DialogTitle>
            <DialogDescription>
              Create a new table for your restaurant.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Table Number
              </Label>
              <Input
                id="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Select
                value={formData.capacity}
                onValueChange={(value) =>
                  handleSelectChange("capacity", value)
                }
              >
                <SelectTrigger id="capacity-select" className="col-span-3">
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  {[2, 4, 6, 8, 10, 12].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} seats
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger id="status-select" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {tableStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleSelectChange("location", value)}
              >
                <SelectTrigger id="location-select" className="col-span-3">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {tableLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTable}>Add Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Table Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Table</DialogTitle>
            <DialogDescription>
              Update the details for this table.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-number" className="text-right">
                Table Number
              </Label>
              <Input
                id="edit-number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-capacity" className="text-right">
                Capacity
              </Label>
              <Select
                value={formData.capacity}
                onValueChange={(value) =>
                  handleSelectChange("capacity", value)
                }
              >
                <SelectTrigger id="edit-capacity-select" className="col-span-3">
                  <SelectValue placeholder="Select capacity" />
                </SelectTrigger>
                <SelectContent>
                  {[2, 4, 6, 8, 10, 12].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} seats
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger id="edit-status-select" className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {tableStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">
                Location
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleSelectChange("location", value)}
              >
                <SelectTrigger id="edit-location-select" className="col-span-3">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {tableLocations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateTable}>Update Table</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this table? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTable}
            >
              Delete Table
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TableManagement;
