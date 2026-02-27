import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { employeesApi } from "../../api/employeesApi";
import { departmentsApi } from "../../api/departmentsApi";
import { authService } from "../../services/authService";
import { notificationService } from "../../services/notificationService";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { Employee, Department } from "../../types";

export const EmployeeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const abilities = authService.getAbilities();

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [managers, setManagers] = useState<Employee[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    careerStartDate: "",
    salary: "",
    role: "Employee",
    departmentId: "",
    reportingManagerId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depts, emps] = await Promise.all([
          departmentsApi.getAll(),
          employeesApi.getAll(),
        ]);
        setDepartments(depts);
        setManagers(emps);

        if (isEdit && id) {
          const employee = await employeesApi.getById(parseInt(id));
          setFormData({
            name: employee.name || "",
            email: employee.email,
            careerStartDate: employee.careerStartDate
              ? employee.careerStartDate.split("T")[0]
              : "",
            salary: employee.salary?.toString() || "",
            role: employee.role || "Employee",
            departmentId: employee.departmentId?.toString() || "",
            reportingManagerId: employee.reportingManagerId?.toString() || "",
          });
        }
      } catch (error: any) {
        notificationService.error(
          error.response?.data?.message || "Failed to fetch data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      const payload: Partial<Employee> = {
        name: formData.name || undefined,
        email: formData.email,
        careerStartDate: formData.careerStartDate || undefined,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
        role: formData.role || undefined,
        departmentId: formData.departmentId
          ? parseInt(formData.departmentId)
          : undefined,
        reportingManagerId: formData.reportingManagerId
          ? parseInt(formData.reportingManagerId)
          : undefined,
      };

      if (isEdit && id) {
        await employeesApi.update(parseInt(id), payload);
        notificationService.success("Employee updated successfully");
      } else {
        await employeesApi.create(payload);
        notificationService.success("Employee created successfully");
      }
      navigate("/employees");
    } catch (error: any) {
      notificationService.error(
        error.response?.data?.message ||
          `Failed to ${isEdit ? "update" : "create"} employee`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Edit Employee" : "Create Employee"}
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            required
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Career Start Date"
            name="careerStartDate"
            type="date"
            value={formData.careerStartDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          {abilities?.permissions.Employee.canSeeSalary && (
            <TextField
              fullWidth
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              margin="normal"
            />
          )}

          {abilities?.permissions.Employee.canEditRole && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
              >
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="RM">RM</MenuItem>
                <MenuItem value="TM">TM</MenuItem>
                <MenuItem value="CTO">CTO</MenuItem>
              </Select>
            </FormControl>
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel>Department</InputLabel>
            <Select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              label="Department"
            >
              <MenuItem value="">None</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Reporting Manager</InputLabel>
            <Select
              name="reportingManagerId"
              value={formData.reportingManagerId}
              onChange={handleChange}
              label="Reporting Manager"
            >
              <MenuItem value="">None</MenuItem>
              {managers.map((manager) => (
                <MenuItem key={manager.id} value={manager.id.toString()}>
                  {manager.name || manager.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Update" : "Create"}
            </Button>
            <Button variant="outlined" onClick={() => navigate("/employees")}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
