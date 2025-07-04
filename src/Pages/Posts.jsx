import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Collapse,
  Snackbar,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  ChatBubbleOutline as CommentIcon,
  Share as ShareIcon,
  Send as SendIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import { useAuth } from "../context/AuthContext";
import api from "../api";

export default function Posts() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Create dialog
  const [openCreate, setOpenCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  // Update dialog
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updatePost, setUpdatePost] = useState(null);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");

  // Delete snackbar
  const [deleteSN, setDeleteSN] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  // Comments
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/posts");
      setPosts(data);
      setError("");
    } catch {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Filters
  const filteredPosts = posts.filter((p) =>
    (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.content || "").toLowerCase().includes(search.toLowerCase())
  );

  // Create handlers
  const openCreateDialog = () => setOpenCreate(true);
  const closeCreateDialog = () => {
    setOpenCreate(false);
    setNewTitle("");
    setNewContent("");
  };
  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    try {
      await api.post("/posts", { title: newTitle, content: newContent });
      closeCreateDialog();
      await fetchPosts();
    } catch {
      setError("Failed to create post");
    }
  };

  // Update handlers
  const openUpdateDialog = (post) => {
    setUpdatePost(post);
    setUpdateTitle(post.title);
    setUpdateContent(post.content);
    setOpenUpdate(true);
  };
  const closeUpdateDialog = () => {
    setOpenUpdate(false);
    setUpdatePost(null);
  };
  const handleUpdate = async () => {
    if (!updatePost) return;
    if (
      updateTitle === updatePost.title &&
      updateContent === updatePost.content
    ) {
      return closeUpdateDialog();
    }
    try {
      await api.put(`/posts/${updatePost.id}`, {
        title: updateTitle,
        content: updateContent,
      });
      closeUpdateDialog();
      await fetchPosts();
    } catch {
      setError("Failed to update post");
    }
  };

  // Delete handlers
  const promptDelete = (postId) => {
    setToDeleteId(postId);
    setDeleteSN(true);
  };
  const handleDelete = async () => {
    try {
      await api.delete(`/posts/${toDeleteId}`);
      setDeleteSN(false);
      setToDeleteId(null);
      await fetchPosts();
    } catch {
      setError("Failed to delete post");
    }
  };
  const cancelDelete = () => {
    setDeleteSN(false);
    setToDeleteId(null);
  };

  // Comments
  const toggleComments = (id) =>
    setOpenCommentsId(openCommentsId === id ? null : id);
  const handleCommentChange = (postId, val) =>
    setCommentTexts((t) => ({ ...t, [postId]: val }));
  const handleAddComment = async (postId) => {
    const text = commentTexts[postId]?.trim();
    if (!text) return;
    try {
      await api.post(`/posts/${postId}/comments`, { content: text });
      setCommentTexts((t) => ({ ...t, [postId]: "" }));
      await fetchPosts();
    } catch {
      setError("Failed to add comment");
    }
  };

  return (
    <Box maxWidth={800} mx="auto" p={2}>
      {/* Search + Add */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 4,
          display: "flex",
          alignItems: "center",
          gap: 2,
          bgcolor: "background.paper",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
          sx={{ whiteSpace: "nowrap" }}
        >
          Create Post
        </Button>
      </Paper>

      {/* List */}
      {loading ? (
        <Typography align="center">Loading posts...</Typography>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : filteredPosts.length === 0 ? (
        <Typography align="center">No posts found.</Typography>
      ) : (
        <Stack spacing={3}>
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              sx={{
                bgcolor: "background.paper",
                boxShadow: 4,
                borderRadius: 2,
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "secondary.main" }}>
                    {post.user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={
                  <Typography variant="subtitle1" fontWeight={600}>
                    {post.user?.name}
                  </Typography>
                }
                subheader={new Date(post.created_at).toLocaleString()}
                sx={{ pb: 0 }}
              />
              <CardContent sx={{ pt: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "primary.main" }}
                >
                  {post.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {post.content}
                </Typography>
              </CardContent>
              <CardActions disableSpacing sx={{ px: 2, pb: 1 }}>
                <IconButton sx={{ color: "primary.main" }}>
                  <ThumbUpIcon />
                </IconButton>
                <IconButton
                  onClick={() => toggleComments(post.id)}
                  sx={{
                    color:
                      openCommentsId === post.id
                        ? "primary.dark"
                        : "text.secondary",
                  }}
                >
                  <CommentIcon />
                </IconButton>
                <IconButton sx={{ color: "text.secondary" }}>
                  <ShareIcon />
                </IconButton>
                {user?.id === post.user_id && (
                  <Box sx={{ marginLeft: "auto" }}>
                    <IconButton
                      sx={{ color: "info.main" }}
                      onClick={() => openUpdateDialog(post)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: "error.main" }}
                      onClick={() => promptDelete(post.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </CardActions>

              {/* Comments */}
              <Collapse
                in={openCommentsId === post.id}
                timeout="auto"
                unmountOnExit
              >
                <Divider />
                <List dense sx={{ maxHeight: 200, overflowY: "auto" }}>
                  {post.comments?.length === 0 ? (
                    <Typography
                      sx={{ p: 1, color: "text.secondary" }}
                      align="center"
                    >
                      No comments yet.
                    </Typography>
                  ) : (
                    post.comments.map((c) => (
                      <ListItem key={c.id} alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            {c.user?.name?.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={c.user?.name}
                          secondary={c.content}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
                <Box display="flex" p={2} gap={1}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Write a comment..."
                    value={commentTexts[post.id] || ""}
                    onChange={(e) =>
                      handleCommentChange(post.id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(post.id);
                      }
                    }}
                  />
                  <IconButton
                    onClick={() => handleAddComment(post.id)}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </Collapse>
            </Card>
          ))}
        </Stack>
      )}

      {/* Create Dialog */}
      <Dialog
        open={openCreate}
        onClose={closeCreateDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          Create New Post
          <IconButton
            onClick={closeCreateDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ py: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              minRows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <Dialog
        open={openUpdate}
        onClose={closeUpdateDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle>
          Update Post
          <IconButton
            onClick={closeUpdateDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ py: 1 }}>
            <TextField
              label="Title"
              fullWidth
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
            />
            <TextField
              label="Content"
              fullWidth
              multiline
              minRows={4}
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpdateDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Snackbar */}
      <Snackbar
        open={deleteSN}
        onClose={cancelDelete}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="warning"
          action={
            <>
              <Button color="error" size="small" onClick={handleDelete}>
                Delete
              </Button>
              <Button color="inherit" size="small" onClick={cancelDelete}>
                Cancel
              </Button>
            </>
          }
        >
          Are you sure you want to delete this post?
        </Alert>
      </Snackbar>
    </Box>
  );
}
