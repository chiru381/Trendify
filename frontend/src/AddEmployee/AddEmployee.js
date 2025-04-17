import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Select, message } from "antd";
import '@ant-design/v5-patch-for-react-19';
import "./AddEmployee.css"; 

const AddEmployee = () => {
  const [employee, setEmployee] = useState("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/employees");
      setManagers(data);
    } catch (error) {
      message.error("Error fetching managers");
    }
  };

  const handler = async (e) => {
    e.preventDefault();
    setEmployee("submitting");

    const formData = new FormData();
    formData.append("employeeName", e.target.employeeName.value);
    formData.append("designation", e.target.designation.value);
    formData.append("dateOfBirth", e.target.dateOfBirth.value);
    formData.append("yearsOfExperience", e.target.yearsOfExperience.value);
    formData.append("reportingManager", selectedManager);
    formData.append("image", e.target.image.files[0]);

    try {
      await axios.post("http://localhost:5000/api/employees", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setEmployee("success");
      e.target.reset();
    } catch (error) {
      setEmployee("error");
    }
  };

  return (
    <div className="container">
      <Button type="primary" onClick={() => setIsModalOpen(true)} className="open-modal-btn">
        Add Employee
      </Button>

      <Modal title="Employee Details" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
        <form onSubmit={handler} className="form-container">
          <label>Employee Name:</label>
          <input type="text" name="employeeName" placeholder="Enter employee name" required />

          <label>Designation:</label>
          <input type="text" name="designation" placeholder="Enter designation" />

          <label>Date of Birth:</label>
          <input type="date" name="dateOfBirth" required />

          <label>Years of Experience:</label>
          <input type="number" name="yearsOfExperience" placeholder="Enter years of experience" min="0" required />

          <label>Reporting Manager:</label>
          <Select placeholder="Select Reporting Manager" className="select-box" onChange={(value) => setSelectedManager(value)}>
            {managers.map((manager) => (
              <Select.Option key={manager._id} value={manager._id}>
                {manager.employeeName}
              </Select.Option>
            ))}
          </Select>

          <label>Choose an image:</label>
          <input type="file" name="image" required />

          <Button type="primary" htmlType="submit" className="submit-btn">
            {employee === "Submitting" ? "Submitting..." : "Submitted"}
          </Button>
        </form>

        {employee === "success" && <p className="success-message">Employee added successfully!</p>}
        {employee === "error" && <p className="error-message">Error Employee Details!</p>}
      </Modal>
    </div>
  );
}

export default AddEmployee;