import { useEffect, useState } from "react";
import axios from "axios";

function FeedbackList() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    axios
      .get("http://127.0.0.1:9000/feedback-list")
      .then((res) => setData(res.data))
      .catch(() => alert("Error fetching feedback list"));
  }, []);

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.phone.includes(search) ||
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>Feedback List</h2>

      <input
        placeholder="Search by name, phone, or email"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />

      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead style={{ background: "#ffc72c" }}>
          <tr>
            <th>Serial No</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Time Slot</th>
            <th>Food Liked</th>
            <th>Photo</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td>{item.serial_no}</td>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.email}</td>
              <td>{item.time_slot}</td>
              <td>{item.food}</td>
              <td>
                <a href={item.image_url} target="_blank" rel="noreferrer">
  View File
</a>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "10px" }}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages || 1}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default FeedbackList;
