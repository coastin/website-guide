


var tour = new Tour({
  steps: [
    {
      element: "#panel1",
      title: "<h4>CURRENCY CHART</h4>",
      content: "Welcome to Betller! <br> Here you can observe BTC/USDT price movements in real-time. Use charts to correctly predict the direction of the Bitcoin price",
      
      placement: "bottom"
    },
    {
      element: "#panel2",
      title: "<h4>TIME ZONE</h4>",
      content: "Select your time-zone here. It is important that you have your timezone correctly!",
      placement: "bottom"
    },
    {
      element: "#panel3",
      title: "<h4>END TIME</h4>",
      content: "Here you can see the current round end time. All rounds expire at 5 mins",
      placement: "bottom"
    },
    {
      element: "#panel4",
      title: "<h4>BASE PRICE</h4>",
      content: "Check the Base price",
      placement: "bottom"
    },
    {
      element: "#panel5",
      title: "<h4>CHOOSE AMOUNT</h4>",
      content: "Choose your bet amount",
      placement: "bottom"
    },
    {
      element: "#panel6",
      title: "<h4>MAKE RIGHT CHOICE</h4>",
      content: "If the price goes UP, seize the moment and click HIGH button. If the price goes DOWN, click LOW button",
      placement: "bottom"
    },
    {
      element: "#game-timer",
      title: "<h4>REMAINING TIME</h4>",
      content: "Here you can check the time remaining until the completion of the current round",
      placement: "bottom"
    },
    {
      element: "#panel8",
      title: "<h4>PLACE BET</h4>",
      content: "Hit Place Bet to complete at the round",
      placement: "bottom"
    },
    {
      element: "#panel9",
      title: "<h4>CHECK THE OTHERS' BET</h4>",
      content: "Here you can watch the bets (HIGH/LOW) of other users",
      placement: "bottom"
    },
    {
      element: "#panel10",
      title: "<h4>CHECK YOUR BET</h4>",
      content: "Here you can see your bet amount and final payout ratio",
      placement: "bottom"
    },
    {
      element: "#panel11",
      title: "<h4>GET PROFIT</h4>",
      content: "After the expiry time, the round is automatically closed. Get your profit in case your bet is correct",
      placement: "bottom"
    }
  ],
  backdrop: true,
  storage: false
});

// tour.init();
// tour.start();
tour.init();
tour.restart();


