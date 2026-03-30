

async function test() {
  const payload = {
    userId: "69c79ceeb127b8094ec2defd",
    eventId: "69c79dbcb127b8094ec2df0f"
  };
  
  const res = await fetch('http://localhost:5000/api/registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const data = await res.json();
  console.log("POST result:", data);
  
  const getRes = await fetch('http://localhost:5000/api/registrations?userId=69c79ceeb127b8094ec2defd');
  const getData = await getRes.json();
  console.log("GET result:", JSON.stringify(getData, null, 2));
}

test();