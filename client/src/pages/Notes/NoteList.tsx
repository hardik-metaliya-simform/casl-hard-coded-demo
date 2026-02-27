import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { notesApi } from "../../api/notesApi";
import { authService } from "../../services/authService";
import { notificationService } from "../../services/notificationService";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import type { Note } from "../../types";

export const NoteList: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const abilities = authService.getAbilities();
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      const data = await notesApi.getAll();
      setNotes(data);
    } catch (error: any) {
      notificationService.error(
        error.response?.data?.message || "Failed to fetch notes",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async () => {
    if (!selectedNote) return;

    try {
      await notesApi.delete(selectedNote.id);
      notificationService.success("Note deleted successfully");
      setDeleteDialogOpen(false);
      fetchNotes();
    } catch (error: any) {
      notificationService.error(
        error.response?.data?.message || "Failed to delete note",
      );
    }
  };

  const openDeleteDialog = (note: Note) => {
    setSelectedNote(note);
    setDeleteDialogOpen(true);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Notes</Typography>
        {abilities?.permissions.Note.create && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/notes/new")}
          >
            Create Note
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Employee</TableCell>
              <TableCell>Admin Only</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No notes found
                </TableCell>
              </TableRow>
            ) : (
              notes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell>{note.id}</TableCell>
                  <TableCell>
                    {note.content.length > 50
                      ? `${note.content.substring(0, 50)}...`
                      : note.content}
                  </TableCell>
                  <TableCell>
                    {note.employee?.name || note.employeeId}
                  </TableCell>
                  <TableCell>
                    {note.isAdminOnly && (
                      <Chip label="Admin Only" size="small" color="warning" />
                    )}
                  </TableCell>
                  <TableCell>
                    {note.createdAt
                      ? new Date(note.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    {abilities?.permissions.Note.update && (
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/notes/${note.id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {abilities?.permissions.Note.delete && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => openDeleteDialog(note)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this note?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
