# smallcase-api

Tech Stack Used - Express.js, Postgres, Redis

Hosted on Heroku - https://portfolio-mohit.herokuapp.com

For testing of APIs , integrated swagger-ui-express, Swagger Dashboard url - https://portfolio-mohit.herokuapp.com/docs

Assumptions made while doing assignment-

1. There is a timestamp associated with a trade. Meaning that If any trade is updated than all the trades occuring after that trade can be afftected. So to handle this I have made sure that a trade can only be updated If the history of following trades are naturally possible. for eg. In trade 1 I buy 10 stocks and in trade 2 I sell 10 stocks then I can't update the trade 1 to having bought 9 stocks.
2. While updating a trade one can even update the stock in that.
3. Current price of any stock will be 100 only in cumulative returns API. In other APIs the price can be variable.

---

Out of the box things done for better performance of application

1. Since a person would want to get his portfolio multiple times so to get that It would not be a good choice to everytime hit the DB and run massive calculations since that that would be a very poor user experience. For that I am storing the user portfolio in redis since that would fetch results at lightening speed. Everytime user performs any trade I update the portfolio in redis.

2. Updating the redis on every trade would mean longer response time so I am doing this process in a separate worker. Since nodejs runs on a single thread I am running separate jobs using a package called "Bull". I am following a producer, consumer and an event listener architecture for this.
   Producer(producer.js) - For pushing the jobs(updating redis) in queue
   Consumer(consumer.js) - For running the jobs
   Event Listener(listerner.js) - To see If job ran successfully

Current Tables of DB-

1. "stocks"
   columns - id, symbol

   current data in this table -
   id  symbol
   1   TCS
   2   WIPRO
   3   GODREJIND

2. "trades"
   columns - id, quantity, price, type, stockId(foreign key), timestamps

   this table is currently empty
