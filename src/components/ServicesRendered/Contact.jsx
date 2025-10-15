"use client"

import { Box, Typography, Button } from "@mui/material"
import CallIcon from "@mui/icons-material/Call"
import SendIcon from "@mui/icons-material/Send"
import ContactMan from "../../assets/images/ServicesRendered/Contact Man.png"

export default function ProblemSolverBanner() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: '#00BCD4',
        borderRadius: '16px',
        p: { xs: 4, md: 6 },
        mx: { xs: 2, md: 'auto' },
        my: { xs: 4, md: 8 },
        maxWidth: '900px',
        color: 'white',
        overflow: 'hidden',
        position: 'relative',
        minHeight: { md: 400 },
      }}
    >
      {/* Left Content Section */}
      <Box
        sx={{
          width: { xs: '100%', md: 400 },
          textAlign: { xs: 'center', md: 'left' },
          mb: { xs: 4, md: 0 },
          zIndex: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '1.8rem', md: '2.5rem' }
          }}
        >
          {'Having A Problem? We\'ll Fix It Today!'}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            fontSize: { xs: '0.9rem', md: '1rem' }
          }}
        >
          {'Get fast, reliable service from trusted professionals. Call us now or request a quick quote — we\'re here to help you anytime.'}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mb: 4,
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CallIcon sx={{ fontSize: 20 }} />
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {'+1 800 123 456 789'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SendIcon sx={{ fontSize: 20 }} />
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {'paniclist@gmail.com'}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#f0f2f5',
            color: '#000',
            fontWeight: 'bold',
            py: 1.5,
            px: 4,
            borderRadius: '8px',
            '&:hover': {
              bgcolor: '#e0e2e5',
            },
          }}
        >
          Call Now
        </Button>
      </Box>

      {/* Image inside main container */}
      <Box
        component="img"
        src={ContactMan}
        alt="Technician pointing"
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: { xs: 250, md: 400 },
          height: 'auto',
          maxHeight: '100%',
          zIndex: 1,
          display: { xs: 'none', md: 'block' },
        }}
      />
    </Box>
  )
}
