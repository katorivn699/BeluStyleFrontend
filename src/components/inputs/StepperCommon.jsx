import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { MdOutlinePendingActions } from "react-icons/md";
import { BiLoaderCircle } from "react-icons/bi";
import { FaBox } from "react-icons/fa";
import { TbShoppingCartCheck, TbShoppingCartX } from "react-icons/tb";

const QontoStepIconRoot = styled("div")(({ theme }) => ({
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: "#784af4",
      },
    },
  ],
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
};

const ColorlibConnector = styled(StepConnector)(({ theme, status }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        status === 4
          ? "linear-gradient(95deg, rgba(255,0,0,1) 0%, rgba(255,127,127,1) 100%)"  // Red gradient for "Canceled"
          : "linear-gradient(95deg, rgba(23,124,216,1) 0%, rgba(41,127,253,1) 44%, rgba(126,204,250,1) 100%)", // Normal gradient
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        status === 4
          ? "linear-gradient(95deg, rgba(255,0,0,1) 0%, rgba(255,127,127,1) 100%)" // Red gradient for "Canceled"
          : "linear-gradient(95deg, rgba(23,124,216,1) 0%, rgba(41,127,253,1) 44%, rgba(126,204,250,1) 100%)", // Normal gradient
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));


const ColorlibStepIconRoot = styled("div")(({ theme, status }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  // Apply a gradient based on the current status
  ...(status === 4 && { // If the status is 4 (Canceled), apply a red gradient
    backgroundImage: "linear-gradient(136deg, rgba(255,0,0,1) 0%, rgba(255,127,127,1) 100%)",
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient(136deg, rgba(23,124,216,1) 0%, rgba(41,127,253,1) 44%, rgba(126,204,250,1) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient(136deg, rgba(23,124,216,1) 0%, rgba(41,127,253,1) 44%, rgba(126,204,250,1) 100%)",
      },
    },
  ],
}));


function ColorlibStepIcon(props) {
  const { active, completed, className, icon, status } = props;

  const icons = {
    1: <MdOutlinePendingActions />,
    2: <BiLoaderCircle />,
    3: <FaBox />,
    4: <TbShoppingCartCheck />,
    5: <TbShoppingCartX />, // Icon for Cancel step
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className} status={status}>
      {icons[String(icon)]}
    </ColorlibStepIconRoot>
  );
}


ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

export default function CustomizedSteppers({ status }) {
  const steps = [
    "Waiting for Confirmation",
    "Being Prepared",
    "On the Way",
    "Delivered",
  ];

  if (status === 4) { // Add "Canceled" step when status is 4
    steps.push("Canceled");
  }

  return (
    <Stepper
      alternativeLabel
      activeStep={status}
      connector={<ColorlibConnector status={status} />} // Pass status to connector
    >
      {steps.map((label, index) => (
        <Step key={index}>
          <StepLabel StepIconComponent={(props) => <ColorlibStepIcon {...props} status={status} />}>
            {label}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

