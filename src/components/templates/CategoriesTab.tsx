"use client";

import { Card } from "@/components/atoms/Card";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import DeleteModal from "@/components/molecules/DeleteModal";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";
import { Variant } from "../../types";
import { Badge, variants } from "../atoms/Badge";
import { EditDeleteActions } from "./EditDeleteActions";
import { Plus, Search, Grid, List, Check, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesTabProps {
  tableName: string;
  title: string;
  description: string;
}

type ViewMode = "grid" | "list";

export const CategoriesTab = ({
  tableName,
  title,
  description,
}: CategoriesTabProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    console.log("🟢 CategoriesTab: Component mounted/updated", {
      tableName,
      loading,
      categoriesCount: categories.length,
      hasError: !!error,
    });
  });

  const fetchCategories = useCallback(async () => {
    console.log("🟢 CategoriesTab: fetchCategories called", {
      tableName,
      currentCategoriesCount: categories.length,
      currentLoading: loading,
    });
    
    setLoading(true);
    setError(null);

    console.log("🟢 CategoriesTab: Loading state set to true", { tableName });

    try {
      const { data, error: fetchError } = await supabase
        .from(tableName)
        .select("*")
        .order("name");

      if (fetchError) {
        throw fetchError;
      }

      console.log("🟢 CategoriesTab: Data fetched successfully", {
        tableName,
        count: data?.length || 0,
      });

      setCategories(data || []);
    } catch (err) {
      console.error("🟢 CategoriesTab: Error fetching categories", {
        tableName,
        error: err,
      });
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
    } finally {
      console.log("🟢 CategoriesTab: Setting loading to false", {
        tableName,
        categoriesCount: categories.length,
      });
      setLoading(false);
    }
  }, [tableName]);

  useEffect(() => {
    console.log("🟢 CategoriesTab: useEffect triggered", {
      tableName,
      fetchCategoriesFunction: typeof fetchCategories,
    });
    fetchCategories();
  }, [fetchCategories]);

  const handleUpdateCategory = async (id: string) => {
    if (!editingName.trim()) return;

    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from(tableName)
        .update({ name: editingName.trim() })
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setCategories((prev) => prev.map((cat) => (cat.id === id ? data : cat)));
      setEditingId(null);
      setEditingName("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update category"
      );
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete category"
      );
    }
  };

  const openDeleteModal = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName("");
  };

  const getVariant = (index: number) => {
    return variants[index % variants.length];
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setIsAdding(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from(tableName)
        .insert([{ name: newCategoryName.trim() }])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      setCategories((prev) => [...prev, data]);
      setNewCategoryName("");
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Only show full-page loader if we're loading AND have no data
  const shouldShowLoader = loading && categories.length === 0;
  
  console.log("🟢 CategoriesTab: Render check", {
    tableName,
    loading,
    categoriesCount: categories.length,
    shouldShowLoader,
  });

  if (shouldShowLoader) {
    console.log("🟢 CategoriesTab: Showing loader", { tableName });
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{description}</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          leftIcon={<Plus className="h-4 w-4" />}
          className="shrink-0"
        >
          Add
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Form */}
      {showAddForm && (
        <Card className="p-6 border-2 border-dashed border-blue-200 bg-blue-50/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Add New Category
            </h3>
          </div>
          <div className="flex gap-3">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category"
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddCategory();
                }
                if (e.key === "Escape") {
                  setShowAddForm(false);
                  setNewCategoryName("");
                }
              }}
              autoFocus
            />
            <Button
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim() || isAdding}
              leftIcon={isAdding ? undefined : <Check className="h-4 w-4" />}
              loading={isAdding}
            >
              <span className="hidden md:inline">
                {isAdding ? "Adding..." : "Add"}
              </span>
            </Button>
            <Button
              onClick={() => {
                setShowAddForm(false);
                setNewCategoryName("");
              }}
              variant="secondary"
              leftIcon={<X className="h-4 w-4" />}
            >
              <span className="hidden md:inline">Cancel</span>
            </Button>
          </div>
        </Card>
      )}

      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode("grid")}
            variant={viewMode === "grid" ? "primary" : "secondary"}
            size="sm"
            leftIcon={<Grid className="h-4 w-4" />}
          >
            Grid
          </Button>
          <Button
            onClick={() => setViewMode("list")}
            variant={viewMode === "list" ? "primary" : "secondary"}
            size="sm"
            leftIcon={<List className="h-4 w-4" />}
          >
            List
          </Button>
        </div>
      </div>

      {/* Categories Display */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Categories ({filteredCategories.length})
          </h3>
          {searchQuery && (
            <p className="text-sm text-gray-500">
              Showing results for &ldquo;{searchQuery}&rdquo;
            </p>
          )}
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Grid className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No categories found" : "No categories yet"}
            </h4>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? `No categories match &ldquo;${searchQuery}&rdquo;. Try a different search term.`
                : "Get started by adding your first category."}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setShowAddForm(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Your First Category
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCategories.map((category, index) => (
              <div
                key={category.id}
                className="group relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:border-gray-300"
              >
                {editingId === category.id ? (
                  <div className="space-y-3">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="w-full"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateCategory(category.id);
                        }
                        if (e.key === "Escape") {
                          cancelEditing();
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleUpdateCategory(category.id)}
                        disabled={!editingName.trim()}
                        size="sm"
                        leftIcon={<Check className="h-3 w-3" />}
                        className="flex-1"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={cancelEditing}
                        variant="secondary"
                        size="sm"
                        leftIcon={<X className="h-3 w-3" />}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <Badge
                        variant={getVariant(index) as Variant}
                        size="medium"
                        className="text-sm"
                      >
                        {category.name}
                      </Badge>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <EditDeleteActions
                          onEdit={() => startEditing(category)}
                          onDelete={() => openDeleteModal(category)}
                        />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created{" "}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCategories.map((category, index) => (
              <div
                key={category.id}
                className="group flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {editingId === category.id ? (
                  <div className="flex items-center gap-3 flex-1">
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleUpdateCategory(category.id);
                        }
                        if (e.key === "Escape") {
                          cancelEditing();
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      onClick={() => handleUpdateCategory(category.id)}
                      disabled={!editingName.trim()}
                      size="sm"
                      leftIcon={<Check className="h-3 w-3" />}
                    >
                      Save
                    </Button>
                    <Button
                      onClick={cancelEditing}
                      variant="secondary"
                      size="sm"
                      leftIcon={<X className="h-3 w-3" />}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={getVariant(index) as Variant}
                        size="medium"
                      >
                        {category.name}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Created{" "}
                        {new Date(category.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <EditDeleteActions
                        onEdit={() => startEditing(category)}
                        onDelete={() => openDeleteModal(category)}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
      >
        <DeleteModal.Action
          onClose={closeDeleteModal}
          onConfirm={() =>
            categoryToDelete && handleDeleteCategory(categoryToDelete.id)
          }
        />
      </DeleteModal>
    </div>
  );
};
