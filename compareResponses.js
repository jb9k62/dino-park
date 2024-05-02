let callCount = 0;

const stripTime = (arr) =>
  arr.map((a) => {
    delete a.time;
    return a;
  });

const call = () =>
  fetch(
    "https://5rz6r1it73.execute-api.eu-west-2.amazonaws.com/nudls/feed"
  ).then((r) => r.json());

call().then((r1) => {
    callCount++;

  const map = {
    [callCount]: JSON.stringify(stripTime(r1)),
  };

  setInterval(
    () =>
      call().then((r) => {
        callCount++;
        map[callCount] = JSON.stringify(stripTime(r));
        
        console.log(
          `Current same as previous? ${map[callCount] === map[callCount - 1]}`
        );

        if (map[callCount] !== map[callCount - 1]) {
          throw new Error("changed!")
        }
      }),
    200
  );
});
