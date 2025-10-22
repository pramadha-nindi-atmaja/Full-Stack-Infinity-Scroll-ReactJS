import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

const LIMIT = 30;

const PersonalList = () => {
  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Fetch personal data from backend
   */
  const getData = useCallback(async () => {
    if (loading) return; // prevent overlapping requests

    try {
      setLoading(true);
      setError("");

      const { data: response } = await axios.get("/api/personal/personals", {
        params: {
          search_query: keyword,
          lastId,
          limit: LIMIT,
        },
      });

      const newData = response?.result || [];

      // Append or reset data
      setData((prev) => (lastId === 0 ? newData : [...prev, ...newData]));
      setTempId(response?.lastId || 0);
      setHasMore(Boolean(response?.hasMore));
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [keyword, lastId, loading]);

  /**
   * Initial & subsequent fetch
   */
  useEffect(() => {
    getData();
  }, [getData]);

  /**
   * Load more data when scrolled
   */
  const fetchMore = () => {
    setLastId(tempId);
  };

  /**
   * Handle search submission
   */
  const handleSearch = (e) => {
    e.preventDefault();
    setLastId(0);
    setData([]);
    setKeyword(query.trim());
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <Form onSubmit={handleSearch}>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button type="submit" variant="info">
                Search
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" dismissible onClose={() => setError("")}>
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <InfiniteScroll
            dataLength={data.length}
            next={fetchMore}
            hasMore={hasMore}
            loader={
              <div className="text-center py-3">
                <Spinner animation="border" size="sm" /> Loading...
              </div>
            }
            endMessage={
              !loading && (
                <p className="text-center text-muted mt-3">
                  No more data to load.
                </p>
              )
            }
          >
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>{item.email}</td>
                    <td>{item.gender}</td>
                    <td>{item.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </InfiniteScroll>
        </Col>
      </Row>
    </Container>
  );
};

export default PersonalList;
