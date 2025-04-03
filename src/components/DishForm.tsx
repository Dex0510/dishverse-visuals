
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import IngredientSelector from "./IngredientSelector";
import DescriptionGenerator from "./DescriptionGenerator";
import DishVisualizer from "./DishVisualizer";
import { Dish } from "@/services/dishService";

interface DishFormProps {
  onSubmit: (dish: Omit<Dish, 'id'>) => void;
  initialData?: Dish;
  categories: string[];
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  price: z.number().positive("Price must be positive."),
  category: z.string().min(1, "Please select a category."),
  description: z.string().optional(),
  ingredients: z.array(z.string()).min(1, "Add at least one ingredient."),
  isAvailable: z.boolean().default(true),
});

const DishForm: React.FC<DishFormProps> = ({
  onSubmit,
  initialData,
  categories
}) => {
  // Initialize form with default values or data from props
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      price: initialData.price,
      category: initialData.category,
      description: initialData.description,
      ingredients: initialData.ingredients,
      isAvailable: initialData.isAvailable
    } : {
      name: "",
      price: 0,
      category: "",
      description: "",
      ingredients: [],
      isAvailable: true
    }
  });
  
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(
    initialData?.ingredients || []
  );
  
  const [description, setDescription] = useState(initialData?.description || "");
  const dishName = form.watch("name");
  
  // Update form values when ingredients or description change
  useEffect(() => {
    form.setValue("ingredients", selectedIngredients);
  }, [selectedIngredients, form]);
  
  useEffect(() => {
    form.setValue("description", description);
  }, [description, form]);
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const dishData: Omit<Dish, 'id'> = {
      name: values.name,
      price: values.price,
      category: values.category,
      description: values.description || "",
      ingredients: values.ingredients,
      imageUrl: initialData?.imageUrl || null,
      isAvailable: values.isAvailable
    };
    
    onSubmit(dishData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Basic Dish Information */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dish Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter dish name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Ingredients */}
            <FormField
              control={form.control}
              name="ingredients"
              render={() => (
                <FormItem>
                  <FormLabel>Ingredients</FormLabel>
                  <FormControl>
                    <IngredientSelector
                      selectedIngredients={selectedIngredients}
                      onChange={setSelectedIngredients}
                      dishName={dishName}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={() => (
                <FormItem>
                  <FormControl>
                    <DescriptionGenerator
                      dishName={dishName}
                      ingredients={selectedIngredients}
                      value={description}
                      onChange={setDescription}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Preview Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Dish Preview</h3>
            <Card className="overflow-hidden">
              <div className="aspect-square">
                <DishVisualizer
                  dishName={dishName || "Your Dish"}
                  ingredients={selectedIngredients}
                  description={description}
                  className="h-full w-full"
                />
              </div>
              <div className="p-4">
                <h4 className="font-medium">{dishName || "Your Dish"}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                  {description || "Dish description will appear here"}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedIngredients.slice(0, 3).map(ing => (
                    <span key={ing} className="text-xs bg-secondary px-2 py-1 rounded">
                      {ing}
                    </span>
                  ))}
                  {selectedIngredients.length > 3 && (
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      +{selectedIngredients.length - 3} more
                    </span>
                  )}
                </div>
                <p className="mt-2 font-bold">
                  {form.watch("price") ? `₹${form.watch("price").toFixed(2)}` : "₹0.00"}
                </p>
              </div>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">
            {initialData ? "Update Dish" : "Create Dish"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DishForm;
