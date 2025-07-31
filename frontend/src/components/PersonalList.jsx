import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

const PersonalList = () => {
  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const limit = 30;
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const getData = async () => {
    const response = await axios.get(
      `/api/personals?search_query=${keyword}&lastId=${lastId}&limit=${limit}`
    );
    const newData = response.data.result;
    setData([...data, ...newData]);
    setTempId(response.data.lastId);
    setHasMore(response.data.hasMore);
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastId, keyword]);

  const fatchMore = () => {
    setLastId(tempId);
  };

  const serchData = (e) => {
    e.preventDefault();
    setLastId(0);
    setData([]);
    setKeyword(query);
  };

  return (
    <>
      <Container className="mt-3">
        <Row>
          <Col>
            <form onSubmit={serchData}>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Search ..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit" variant="info">
                  Search
                </Button>
              </InputGroup>
            </form>
          </Col>
        </Row>
        <Row>
          <Col>
            <InfiniteScroll
              dataLength={data.length}
              next={fatchMore}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
            >
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Ip Address</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
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
    </>
  );
};

export default PersonalList;
