import { useState, Dispatch, SetStateAction } from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const MethodList: React.FunctionComponent<{
  groupName: string;
  methods: string[];
  onClickMethod: (method: string) => void;
}> = ({ groupName, methods, onClickMethod }) => {
  const [open, setOpen] = useState(true);

  return (
    <>
      <ListItemButton onClick={() => setOpen(!open)}>
        <ListItemText primary={groupName} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto">
        <List component="a" disablePadding>
          {methods.sort().map((name, index) => (
            <ListItemButton
              key={`${name}_${index}`}
              sx={{ pl: 4 }}
              onClick={() => onClickMethod(name)}
            >
              <ListItemText primary={name} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default MethodList;
