import Layout, { Content } from "antd/lib/layout/layout";
import { Fragment } from "react";
import styled from "styled-components";
import "./App.css";
import Taskboard from "./components/tasksBoard/TasksBoard";

const StyledLayout = styled(Layout)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const StyledContent = styled(Content)`
  background-color: rgba(236, 236, 236, 0.67);
`;

function App() {
  return (
    <StyledLayout>
        <Fragment>
          <StyledContent>
            <Taskboard />
          </StyledContent>
        </Fragment>
    </StyledLayout>
  );
}

export default App;
