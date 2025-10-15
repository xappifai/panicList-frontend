// components/OfferedServicesCard.jsx
import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom";
import handymanImage from "../../assets/images/LandingPage/handyman.png"; // default image

/**
 * Props:
 *  - image: string (url of the service image)
 *  - title: string
 *  - description: string
 *  - onReadMore: (title: string) => void
 */
const OfferedServicesCard = ({
  image,
  title = "",
  description,
  onReadMore,
}) => {
  // slugify the title for the URL
  const slug = encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"));
  const linkPath = `/services/${slug}`;

  return (
    <Card
      component={Link}
      to={linkPath}
      onClick={() => onReadMore?.(title)}
      sx={{
        maxWidth: 320,
        borderRadius: "20px",
        boxShadow: 0,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        overflow: "hidden",
        backgroundColor: "#F5F8FE",
        display: "flex",
        flexDirection: "column",
        p: 1,
        cursor: "pointer", // pointer on hover
        textDecoration: "none", // remove underline
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 1,
        },
        // arrow slide on hover
        "&:hover .MuiButton-endIcon": {
          transform: "translateX(4px)",
        },
      }}
    >
      {/* Image */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            width: "100%",
            height: 200,
            objectFit: "cover",
            borderRadius: "20px",
          }}
        />
      </Box>

      {/* Text & Button */}
      <CardContent
        sx={{
          p: 3,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 700,
              color: "primary.dark",
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Manrope, sans-serif",
              fontWeight: 400,
              color: "primary.dark",
              mb: 2,
            }}
          >
            {description}
          </Typography>
        </Box>

        <Button
          disableRipple
          endIcon={<ArrowForwardIosIcon />}
          sx={{
            textTransform: "none",
            fontFamily: "Manrope, sans-serif",
            fontWeight: 700,
            color: "primary.dark",
            display: "flex",
            justifyContent: "flex-start",
            p: 0,
            minWidth: 0,
            "&:hover": {
              backgroundColor: "transparent", // no bg change on hover
            },
            "& .MuiButton-endIcon": {
              transition: "transform 0.3s ease",
            },
          }}
        >
          READ MORE
        </Button>
      </CardContent>
    </Card>
  );
};

OfferedServicesCard.defaultProps = {
  image: handymanImage,
  title: "Moving Services",
  description:
    "Residential and commercial moving, packing, and storage solutions.",
  onReadMore: () => {},
};

export default OfferedServicesCard;
