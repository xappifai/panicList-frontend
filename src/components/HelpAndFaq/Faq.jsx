import React from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DescriptionIcon from "@mui/icons-material/Description";

const faqItems = [
  "Et dicit vidisse epicurei pri",
  "Partem vocibus omittam pri ne",
  "Impedti torquatos quo in",
  "Quo eu soleat facilisi menandri",
  "Ad sit virtute rationibus efficiantur",
  "Case debet appareat duo cu",
  "Nec omnis alienum no",
  "Et dicit vidisse epicurei pri",
];

const Faq = () => {
  const mid = Math.ceil(faqItems.length / 2);
  const leftItems = faqItems.slice(0, mid);
  const rightItems = faqItems.slice(mid);

  return (
    <Box
      component="section"
      sx={{
        fontFamily: "'Manrope', sans-serif",
        height: 700,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        bgcolor: "background.paper",
        px: { xs: 2, md: 0 },
      }}
    >
      <Container maxWidth="lg">
        {/* Heading with underline accent */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 40,
              height: 4,
              bgcolor: "primary.main",
              mx: "auto",
              mb: 1,
              borderRadius: 2,
            }}
          />
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            Payments FAQ
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Cum doctus civibus efficiantur in imperdiet deterruisset.
          </Typography>
        </Box>

        {/* FAQ items in centered flex two columns */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
            fontFamily: "'Manrope', sans-serif",
          }}
        >
          {[leftItems, rightItems].map((column, colIndex) => (
            <Box
              key={colIndex}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: { xs: "100%", sm: "48%", md: "40%" },
              }}
            >
              {column.map((text, idx) => (
                <Accordion
                  key={idx}
                  disableGutters
                  elevation={0}
                  sx={{ mb: idx < column.length - 1 ? 2 : 0 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#444444" }} />}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <DescriptionIcon sx={{ color: "#444444", mr: 1 }} />
                    <Typography variant="body2" sx={{ color: "#444444" }}>
                      {text}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ color: "#444444" }}>
                      {text}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Faq;
