import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { MoreHorizontal, Edit2, Trash2, Plus, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

// Mock data type
interface TableData {
  id: string;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "reserved" | "cleaning";
  section: string;
}

interface SectionData {
  id: string;
  name: string;
  capacity: number;
  tables: TableData[];
}

const defaultTable: Omit<TableData, 'id'> = {
  name: "New Table",
  capacity: 2,
  status: "available",
  section: "main"
};

const defaultSection: Omit<SectionData, 'id' | 'tables'> = {
  name: "New Section",
  capacity: 20,
};

const TableManagement = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isTableDrawerOpen, setIsTableDrawerOpen] = useState(false);
  const [isSectionDrawerOpen, setIsSectionDrawerOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableData | null>(null);
  const [editingSection, setEditingSection] = useState<SectionData | null>(null);
  const [newTable, setNewTable] = useState<Omit<TableData, 'id'>>(defaultTable);
  const [newSection, setNewSection] = useState<Omit<SectionData, 'id' | 'tables'>>(defaultSection);
  const { toast } = useToast();

  useEffect(() => {
    // Mock API call to fetch tables
    const fetchTables = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockTables = [
        { id: "1", name: "Table 1", capacity: 4, status: "available", section: "main" },
        { id: "2", name: "Table 2", capacity: 2, status: "occupied", section: "main" },
        { id: "3", name: "Table 3", capacity: 6, status: "available", section: "main" },
        { id: "4", name: "Table 4", capacity: 4, status: "reserved", section: "main" },
        { id: "5", name: "Table 5", capacity: 4, status: "available", section: "outdoor" },
        { id: "6", name: "Table 6", capacity: 4, status: "cleaning", section: "outdoor" },
        { id: "7", name: "Table 7", capacity: 8, status: "available", section: "private" },
        { id: "8", name: "Table 8", capacity: 4, status: "reserved", section: "private" },
      ];
      setTables(mockTables);
    };

    // Mock API call to fetch sections
    const fetchSections = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockSections = [
        {
          id: "main",
          name: "Main Floor",
          capacity: 40,
          tables: tables.filter(table => table.section === "main"),
        },
        {
          id: "outdoor",
          name: "Outdoor Patio",
          capacity: 20,
          tables: tables.filter(table => table.section === "outdoor"),
        },
        {
          id: "private",
          name: "Private Room",
          capacity: 12,
          tables: tables.filter(table => table.section === "private"),
        },
      ];
      setSections(mockSections);
    };

    fetchTables();
    fetchSections();
  }, []);

  useEffect(() => {
    if (sections.length > 0) {
      setSelectedSection(sections[0].id);
    }
  }, [sections]);

  // Handlers for table operations
  const handleOpenTableDrawer = () => {
    setNewTable(defaultTable);
    setEditingTable(null);
    setIsTableDrawerOpen(true);
  };

  const handleCloseTableDrawer = () => {
    setIsTableDrawerOpen(false);
  };

  const handleCreateTable = async () => {
    if (!selectedSection) {
      toast({
        title: "Error",
        description: "Please select a section first.",
        variant: "destructive",
      });
      return;
    }

    const newTableId = uuidv4();
    const newTableData: TableData = {
      id: newTableId,
      ...newTable,
    };

    // Optimistically update the tables state
    setTables([...tables, newTableData]);

    // Optimistically update the sections state
    setSections(prevSections => {
      return prevSections.map(section => {
        if (section.id === selectedSection) {
          return {
            ...section,
            tables: [...section.tables, newTableData],
          };
        }
        return section;
      });
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: "Success",
      description: "Table created successfully.",
    });

    handleCloseTableDrawer();
  };

  const handleEditTable = (table: TableData) => {
    setEditingTable(table);
    setNewTable(table);
    setIsTableDrawerOpen(true);
  };

  const handleUpdateTable = async () => {
    if (!editingTable) {
      toast({
        title: "Error",
        description: "No table is being edited.",
        variant: "destructive",
      });
      return;
    }

    const updatedTableData: TableData = {
      id: editingTable.id,
      ...newTable,
    };

    // Optimistically update the tables state
    setTables(prevTables => {
      return prevTables.map(table => {
        if (table.id === editingTable.id) {
          return updatedTableData;
        }
        return table;
      });
    });

    // Optimistically update the sections state
    setSections(prevSections => {
      return prevSections.map(section => {
        return {
          ...section,
          tables: section.tables.map(table => {
            if (table.id === editingTable.id) {
              return updatedTableData;
            }
            return table;
          }),
        };
      });
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: "Success",
      description: "Table updated successfully.",
    });

    handleCloseTableDrawer();
  };

  const handleDeleteTable = async (tableId: string) => {
    // Optimistically update the tables state
    setTables(prevTables => {
      return prevTables.filter(table => table.id !== tableId);
    });

    // Optimistically update the sections state
    setSections(prevSections => {
      return prevSections.map(section => {
        return {
          ...section,
          tables: section.tables.filter(table => table.id !== tableId),
        };
      });
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: "Success",
      description: "Table deleted successfully.",
    });
  };

  // Handlers for section operations
  const handleOpenSectionDrawer = () => {
    setNewSection(defaultSection);
    setEditingSection(null);
    setIsSectionDrawerOpen(true);
  };

  const handleCloseSectionDrawer = () => {
    setIsSectionDrawerOpen(false);
  };

  const handleCreateSection = async () => {
    const newSectionId = uuidv4();
    const newSectionData: SectionData = {
      id: newSectionId,
      ...newSection,
      tables: [],
    };

    // Optimistically update the sections state
    setSections([...sections, newSectionData]);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: "Success",
      description: "Section created successfully.",
    });

    handleCloseSectionDrawer();
  };

  const handleEditSection = (section: SectionData) => {
    setEditingSection(section);
    setNewSection(section);
    setIsSectionDrawerOpen(true);
  };

  const handleUpdateSection = async () => {
    if (!editingSection) {
      toast({
        title: "Error",
        description: "No section is being edited.",
        variant: "destructive",
      });
      return;
    }

    const updatedSectionData: SectionData = {
      id: editingSection.id,
      ...newSection,
      tables: editingSection.tables,
    };

    // Optimistically update the sections state
    setSections(prevSections => {
      return prevSections.map(section => {
        if (section.id === editingSection.id) {
          return updatedSectionData;
        }
        return section;
      });
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: "Success",
      description: "Section updated successfully.",
    });

    handleCloseSectionDrawer();
  };

  const handleDeleteSection = async (sectionId: string) => {
    // Optimistically update the sections state
    setSections(prevSections => {
      return prevSections.filter(section => section.id !== sectionId);
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    toast({
      title: "Success",
      description: "Section deleted successfully.",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Table Management</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleOpenSectionDrawer}>
            Add Section
          </Button>
          <Button onClick={handleOpenTableDrawer}>Add Table</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sections List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Sections</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.id}>
                  <TableCell>{section.name}</TableCell>
                  <TableCell>{section.capacity}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditSection(section)}>
                          <Edit2 className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/50">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. All data associated with this section will be
                                permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDeleteSection(section.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Tables List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Tables</h2>
          {sections.map((section) => (
            <div key={section.id}>
              <h3 className="text-lg font-medium mb-2">{section.name} Tables</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables
                    .filter((table) => table.section === section.id)
                    .map((table) => (
                      <TableRow key={table.id}>
                        <TableCell>{table.name}</TableCell>
                        <TableCell>{table.capacity}</TableCell>
                        <TableCell>{table.status}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditTable(table)}>
                                <Edit2 className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-destructive focus:bg-destructive/50">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. All data associated with this table will be
                                      permanently deleted.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={() => handleDeleteTable(table.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </div>

      {/* Table Drawer */}
      <Drawer open={isTableDrawerOpen} onOpenChange={setIsTableDrawerOpen}>
        <DrawerTrigger asChild>
          <Button>Open</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editingTable ? "Edit Table" : "Create Table"}</DrawerTitle>
            <DrawerDescription>
              {editingTable ? "Update table details." : "Add a new table to a section."}
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newTable.name}
                onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input
                type="number"
                id="capacity"
                value={String(newTable.capacity)}
                onChange={(e) =>
                  setNewTable({ ...newTable, capacity: Number(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select onValueChange={(value) => setNewTable({ ...newTable, status: value as TableData["status"] })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" defaultValue={newTable.status} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="section" className="text-right">
                Section
              </Label>
              <Select onValueChange={(value) => setNewTable({ ...newTable, section: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a section" defaultValue={newTable.section} />
                </SelectTrigger>
                <SelectContent>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DrawerFooter>
            <Button variant="outline" onClick={handleCloseTableDrawer}>
              Cancel
            </Button>
            <Button onClick={editingTable ? handleUpdateTable : handleCreateTable}>
              {editingTable ? "Update Table" : "Create Table"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Section Drawer */}
      <Drawer open={isSectionDrawerOpen} onOpenChange={setIsSectionDrawerOpen}>
        <DrawerTrigger asChild>
          <Button>Open</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{editingSection ? "Edit Section" : "Create Section"}</DrawerTitle>
            <DrawerDescription>
              {editingSection ? "Update section details." : "Add a new section."}
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newSection.name}
                onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input
                type="number"
                id="capacity"
                value={String(newSection.capacity)}
                onChange={(e) =>
                  setNewSection({ ...newSection, capacity: Number(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DrawerFooter>
            <Button variant="outline" onClick={handleCloseSectionDrawer}>
              Cancel
            </Button>
            <Button onClick={editingSection ? handleUpdateSection : handleCreateSection}>
              {editingSection ? "Update Section" : "Create Section"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default TableManagement;
