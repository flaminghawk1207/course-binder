import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { type NextPage } from "next";
import { Fragment, use } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Channel, CHANNEL_ROLE, User } from "~/types";
import { DEF_LAB_TEMPLATE, DEF_TEMPLATE, apiReq } from "~/utils";
import  Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";

const AdminDialog = () => {
    return(
        
    );
}