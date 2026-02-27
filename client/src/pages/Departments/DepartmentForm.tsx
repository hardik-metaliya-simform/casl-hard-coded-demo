import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { departmentsApi } from "../../api/departmentsApi";
import { notificationService } from "../../services/notificationService";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export const DepartmentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!isEdit || !id) return;

      try {
        const department = await departmentsApi.getById(parseInt(id));
        setFormData({
          name: department.name,
          description: department.description || "",
        });
      } catch (error: any) {
        notificationService.error(
          error.response?.data?.message || "Failed to fetch department",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
      };

      if (isEdit && id) {
        await departmentsApi.update(parseInt(id), payload);
        notificationService.success("Department updated successfully");
      } else {
        await departmentsApi.create(payload);
        notificationService.success("Department created successfully");
      }
      navigate("/departments");
    } catch (error: any) {
      notificationService.error(
        error.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} department`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Edit Department" : "Create Department"}
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            required
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/departments")}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
