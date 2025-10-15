import React, { useEffect, useRef, useState } from "react";
import ProviderAuthGuard from "./ProviderAuthGuard";
import {
  Box,
  Typography,
  TextField,
  Card,
  Switch,
  FormControlLabel,
  Avatar,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { authAPI } from "../../services/apiService";

export default function ProviderProfile() {
  const [twoFA, setTwoFA] = useState(true);
  const [notify, setNotify] = useState({ email: true, sms: true, app: true });
  const [form, setForm] = useState({ fullName: "", phoneNumber: "", email: "", address: "", businessHours: "" });
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarChanged, setAvatarChanged] = useState(false);
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const inputSx = {
    background: '#FFFFFF',
    '& input': {
      color: '#111827',
      '::placeholder': { color: '#9CA3AF', opacity: 1 },
    },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#D1D5DB' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#9CA3AF' },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00ADB4' },
  };

  useEffect(() => {
    // Prefill from local storage user and backend if needed
    const local = JSON.parse(localStorage.getItem('user') || '{}');
    setForm({
      fullName: local.fullName || "",
      phoneNumber: local.phoneNumber || "",
      email: local.email || "",
      address: local.address?.street ? `${local.address.street}` : "",
      businessHours: local.businessHours || "",
    });
    setAvatarPreview(local.profileImage || "");
  }, []);

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async () => {
    try {
      setSaving(true);
      // Build generic payload with only non-empty fields
      const genericPayload = {};
      if (form.fullName?.trim()) genericPayload.fullName = form.fullName.trim();
      if (form.phoneNumber?.trim()) {
        const phone = form.phoneNumber.trim();
        const e164 = /^\+?[1-9]\d{1,14}$/;
        if (!e164.test(phone)) {
          setSnackbar({ open: true, message: 'Phone number must be E.164 format (e.g., +1234567890)', severity: 'error' });
          setSaving(false);
          return;
        }
        genericPayload.phoneNumber = phone;
      }
      if (form.address?.trim()) genericPayload.address = { street: form.address.trim() };
      if (avatarChanged && avatarPreview) genericPayload.profileImage = avatarPreview;

      let genericRes = { success: true };
      if (Object.keys(genericPayload).length > 0) {
        genericRes = await authAPI.updateProfile(genericPayload);
      }

      // Provider-specific update only when provided
      if (form.businessHours?.trim()) {
        await authAPI.updateProviderProfile({ businessInfo: { description: form.businessHours.trim() } });
      }

      if (genericRes?.success) {
        // Refresh user from backend so local copy stays accurate
        try {
          const me = await authAPI.getCurrentUser();
          if (me?.success) localStorage.setItem('user', JSON.stringify(me.user));
        } catch {}
        setSnackbar({ open: true, message: 'Updated successfully', severity: 'success' });
        setEditMode(false);
      } else {
        const msg = typeof genericRes === 'string' ? genericRes : 'Update failed';
        setSnackbar({ open: true, message: msg, severity: 'error' });
      }
    } catch (e) {
      const message = e?.message || e?.error || (Array.isArray(e?.errors) ? e.errors.join(', ') : 'Update failed');
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePickAvatar = () => {
    setEditMode(true);
    fileInputRef.current?.click();
  };

  const handleAvatarSelected = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(String(reader.result));
      setAvatarChanged(true);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
    <ProviderAuthGuard>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827" }}>Profile</Typography>
          <Button variant="contained" onClick={() => (editMode ? handleSave() : setEditMode(true))} disabled={saving} sx={{ textTransform: 'none', background: '#00ADB4' }}>{editMode ? (saving ? 'Saving...' : 'Save') : 'Edit'}</Button>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 280px" }, gap: 3 }}>
          {/* Left form column */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Profile Info */}
            <Card elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827", mb: 2 }}>Profile Info</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box>
                  <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 0.5 }}>Business/Provider Name</Typography>
                  <TextField size="small" fullWidth value={form.fullName} onChange={handleChange('fullName')} sx={inputSx} disabled={!editMode} />
                </Box>
                <Box>
                  <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 0.5 }}>Phone</Typography>
                  <TextField size="small" fullWidth value={form.phoneNumber} onChange={handleChange('phoneNumber')} sx={inputSx} disabled={!editMode} />
                </Box>
                <Box>
                  <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 0.5 }}>Email</Typography>
                  <TextField size="small" fullWidth value={form.email} disabled sx={{ ...inputSx, '& input.Mui-disabled': { WebkitTextFillColor: '#6B7280' } }} />
                </Box>
                <Box>
                  <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 0.5 }}>Address</Typography>
                  <TextField size="small" fullWidth value={form.address} onChange={handleChange('address')} sx={inputSx} disabled={!editMode} />
                </Box>
                <Box>
                  <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 0.5 }}>Business Hours</Typography>
                  <TextField size="small" fullWidth value={form.businessHours} onChange={handleChange('businessHours')} sx={inputSx} disabled={!editMode} />
                </Box>
              </Box>
            </Card>

            {/* Account Security */}
            <Card elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827", mb: 2 }}>Account Security</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box>
                  <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 0.5 }}>Current Password</Typography>
                  <TextField type="password" size="small" fullWidth />
                </Box>
                <Box>
                  <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 0.5 }}>Change Password</Typography>
                  <TextField type="password" size="small" fullWidth />
                </Box>
                <Box>
                  <Typography sx={{ color: "#6B7280", fontSize: 12, mb: 0.5 }}>Confirm Password</Typography>
                  <TextField type="password" size="small" fullWidth />
                </Box>
                <Divider sx={{ my: 1 }} />
                <FormControlLabel
                  control={<Switch checked={twoFA} onChange={(e) => setTwoFA(e.target.checked)} disabled={!editMode} />}
                  label={<Typography sx={{ color: "#111827" }}>Two-Factor Authentication</Typography>}
                  sx={{ m: 0 }}
                />
              </Box>
            </Card>

            {/* Notification Settings */}
            <Card elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827", mb: 1 }}>Notification Settings</Typography>
              <FormControlLabel
                control={<Switch checked={notify.email} onChange={(e) => setNotify({ ...notify, email: e.target.checked })} disabled={!editMode} />}
                label={<Typography sx={{ color: "#111827" }}>Email Notifications</Typography>}
                sx={{ m: 0, py: 1 }}
              />
              <Divider />
              <FormControlLabel
                control={<Switch checked={notify.sms} onChange={(e) => setNotify({ ...notify, sms: e.target.checked })} disabled={!editMode} />}
                label={<Typography sx={{ color: "#111827" }}>SMS Notifications</Typography>}
                sx={{ m: 0, py: 1 }}
              />
              <Divider />
              <FormControlLabel
                control={<Switch checked={notify.app} onChange={(e) => setNotify({ ...notify, app: e.target.checked })} disabled={!editMode} />}
                label={<Typography sx={{ color: "#111827" }}>In-App Notifications</Typography>}
                sx={{ m: 0, py: 1 }}
              />
              {/* Save button moved to header */}
            </Card>
          </Box>

          {/* Right profile avatar */}
          <Card elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: 2, alignSelf: 'start', display: { xs: 'none', lg: 'block' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <Avatar src={avatarPreview || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} sx={{ width: 140, height: 140 }} />
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarSelected} style={{ display: 'none' }} />
              <Button variant="text" size="small" onClick={handlePickAvatar} sx={{ textTransform: 'none', color: '#00ADB4' }}>Edit</Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </ProviderAuthGuard>
    <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
    </>
  );
}


