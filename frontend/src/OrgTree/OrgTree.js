import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tree, TreeNode } from "react-organizational-chart";
import "./OrgTree.css";

const OrgTree = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(employees, 'employees');
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios
      .get("http://localhost:5000/api/employees")
      .then((response) => {
        setEmployees(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setLoading(false);
      });
  };

  // Convert flat list to hierarchical structure
  const buildTree = () => {
    const employeeMap = {};
    employees.forEach((emp) => (employeeMap[emp._id] = { ...emp, children: [] }));
    const rootNodes = [];
    employees.forEach((emp) => {
      if (emp.reportingManager) {
        employeeMap[emp.reportingManager]?.children.push(employeeMap[emp._id]);
      } else {
        rootNodes.push(employeeMap[emp._id]);
      }
    });

    return rootNodes;
  };

  // Render Tree Recursively
  const renderTree = (node) => {
    console.log(node, 'node')
    return (
    <TreeNode
      label={
        <div className="node">
          <img style={{ width: '100px', height: '50px'}} src={`http://localhost:5000/${node.employeeImage}`} alt={node.employeeName} className="emp-img" /> 
          <div>{node.employeeName}</div>
          <small>{node.designation}</small>
        </div>
      }
      key={node._id}
    >
      {node.children.map((child) => renderTree(child))}
    </TreeNode>
  );
  }

  const treeData = buildTree();

  return (
    <div className="org-container">
      <h2>Employee Organization Chart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Tree
          lineWidth={"2px"}
          lineColor={"blue"}
          lineBorderRadius={"10px"}
          label={<div className="node">{treeData[0]?.employeeName || "Organization"}</div>}
        >
          {treeData.map((child) => renderTree(child))}
        </Tree>
      )}
    </div>
  );
};

export default OrgTree;
