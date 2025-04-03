
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table as TableType, getSections } from "@/services/tableService";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

interface TableSelectorProps {
  selectedTable: string;
  onSelectTable: (tableName: string) => void;
}

const TableSelector: React.FC<TableSelectorProps> = ({
  selectedTable,
  onSelectTable,
}) => {
  const [open, setOpen] = useState(false);
  const [sections, setSections] = useState<Array<{
    id: string;
    name: string;
    tables: TableType[];
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setIsLoading(true);
        const sectionsData = await getSections();
        setSections(sectionsData);
        if (sectionsData.length > 0) {
          setActiveSection(sectionsData[0].id);
        }
      } catch (error) {
        console.error("Error fetching table sections:", error);
        toast.error("Failed to load tables. Please try again.");
        // Use mock data for demo purposes
        const mockSections = [
          {
            id: "main",
            name: "Main Floor",
            capacity: 40,
            tables: [
              { id: "1", name: "Table 1", capacity: 4, status: "available", section: "main" },
              { id: "2", name: "Table 2", capacity: 2, status: "occupied", section: "main" },
              { id: "3", name: "Table 3", capacity: 6, status: "available", section: "main" },
              { id: "4", name: "Table 4", capacity: 4, status: "reserved", section: "main" },
            ],
          },
          {
            id: "outdoor",
            name: "Outdoor Patio",
            capacity: 20,
            tables: [
              { id: "5", name: "Table 5", capacity: 4, status: "available", section: "outdoor" },
              { id: "6", name: "Table 6", capacity: 4, status: "cleaning", section: "outdoor" },
            ],
          },
          {
            id: "private",
            name: "Private Room",
            capacity: 12,
            tables: [
              { id: "7", name: "Table 7", capacity: 8, status: "available", section: "private" },
              { id: "8", name: "Table 8", capacity: 4, status: "reserved", section: "private" },
            ],
          },
        ];
        setSections(mockSections);
        setActiveSection("main");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleSelectTable = (tableName: string) => {
    onSelectTable(tableName);
    setOpen(false);
  };

  const getStatusColor = (status: TableType["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-500 text-green-700";
      case "occupied":
        return "bg-red-100 border-red-500 text-red-700";
      case "reserved":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "cleaning":
        return "bg-blue-100 border-blue-500 text-blue-700";
      default:
        return "bg-gray-100 border-gray-500 text-gray-700";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          {selectedTable}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select a Table</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <Tabs
            value={activeSection}
            onValueChange={setActiveSection}
            className="w-full"
          >
            <TabsList className="w-full justify-start mb-4 overflow-x-auto">
              {sections.map((section) => (
                <TabsTrigger key={section.id} value={section.id}>
                  {section.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {sections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
                  {section.tables.map((table) => (
                    <Button
                      key={table.id}
                      variant="outline"
                      className={`h-20 flex flex-col items-center justify-center border-2 ${getStatusColor(
                        table.status
                      )}`}
                      onClick={() => handleSelectTable(table.name)}
                      disabled={table.status !== "available"}
                    >
                      <span className="font-medium">{table.name}</span>
                      <span className="text-xs mt-1">
                        {table.capacity} seats • {table.status}
                      </span>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TableSelector;
