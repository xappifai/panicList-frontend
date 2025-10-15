import React from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TableContainer,
  Paper,
  useTheme,
  Chip,
} from "@mui/material";

const plans = [
  { title: "Standard", price: "00.99/m" },
  { title: "Ultimate", price: "19.99/m", popular: true },
  { title: "Advanced", price: "29.99/m" },
  { title: "Professional", price: "49.99/m" },
];

const features = [
  "25k Transactions for more",
  "Get Low Pricing",
  "Token White Labelled Farms",
  "Advanced Route Optimization",
  "Broadcast Feature",
  "Branded Agent Dashboard",
];

const PricingTable = () => {
  const theme = useTheme();

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 12 }, bgcolor: "#FAFAFA" }}>
      <Container maxWidth="lg">
        <Typography
          variant="overline"
          display="block"
          sx={{
            color: theme.palette.primary.main,
            textAlign: "center",
            mb: 1,
            fontFamily: "'Jost', sans-serif",
            fontWeight: 400,
          }}
        >
          PRICE TABLE
        </Typography>
        <Typography
          variant="h4"
          align="center"
          sx={{
            fontFamily: "'Manrope', sans-serif",
            fontWeight: 800,
            mb: 4,
          }}
        >
          Our Best Pricing Table
        </Typography>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 4,
            overflowX: "auto",
            boxShadow: "none",
            width: "100%",
          }}
        >
          <Table
            sx={{
              fontFamily: "'Manrope', sans-serif",
              borderCollapse: "collapse",
              minWidth: 650,
              "& .MuiTableCell-root": {
                border: "1px solid #251A371A",
                whiteSpace: "nowrap",
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell />
                {plans.map((plan) => (
                  <TableCell
                    key={plan.title}
                    align="center"
                    sx={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 600,
                      color: plan.popular
                        ? theme.palette.common.white
                        : theme.palette.primary.main,
                      ...(plan.popular && {
                        bgcolor: theme.palette.primary.main,
                        position: "relative",
                        overflow: "visible",
                        zIndex: 1,
                      }),
                    }}
                  >
                    {plan.title.toUpperCase()}
                    {plan.popular && (
                      <Chip
                        label="Most Popular"
                        size="small"
                        sx={{
                          ml: 1,
                          bgcolor: "#55E5E5",
                          color: theme.palette.common.white,
                          fontFamily: "'Jost', sans-serif",
                          fontWeight: 400,
                          fontSize: "0.75rem",
                        }}
                      />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 800,
                    color: theme.palette.primary.main,
                    bgcolor: "#FAFAFA",
                  }}
                >
                  Price $/ Month
                </TableCell>

                {plans.map((plan) => (
                  <TableCell
                    key={plan.title}
                    align="center"
                    sx={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 800,
                      fontSize: "1.25rem",
                      color: plan.popular
                        ? theme.palette.common.white
                        : theme.palette.common.black,
                      bgcolor: plan.popular
                        ? theme.palette.primary.main
                        : "#FAFAFA",
                    }}
                  >
                    ${plan.price}
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ bgcolor: theme.palette.common.white }}>
                  <Box
                    component="ul"
                    sx={{
                      pl: 2,
                      m: 0,
                      listStyle: "disc",
                      fontFamily: "'Manrope', sans-serif",
                    }}
                  >
                    {features.map((feat) => (
                      <li key={feat}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontFamily: "'Jost', sans-serif",
                            fontWeight: 400,
                          }}
                        >
                          {feat}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                </TableCell>

                {plans.map((plan) => (
                  <TableCell
                    key={plan.title}
                    sx={{
                      bgcolor: plan.popular
                        ? theme.palette.primary.main
                        : theme.palette.common.white,
                    }}
                  />
                ))}
              </TableRow>

              <TableRow>
                <TableCell />

                {plans.map((plan) => (
                  <TableCell
                    key={plan.title}
                    align="center"
                    sx={{
                      bgcolor: plan.popular
                        ? theme.palette.primary.main
                        : theme.palette.common.white,
                    }}
                  >
                    <Button
                      size="medium"
                      sx={{
                        textTransform: "none",
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 500,
                        borderRadius: "50px",
                        width: 150,
                        bgcolor: "#FAFAFA",
                        color: "#666666",
                        border: plan.popular
                          ? "none"
                          : `1px solid ${theme.palette.grey[300]}`,
                        "&:hover": {
                          bgcolor: "#FAFAFA",
                        },
                      }}
                    >
                      → Read More
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default PricingTable;
