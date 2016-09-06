'use strict';

module.exports = function* ({ to_database, to_client }) {
  // how about `yield to_anyone('someone just do the thing please')`
  // Shouty RPC © cody inc. llc 2016

  const a = yield to_database({ some_query: 'who cares' });
  const b = yield to_client('what is b?', { encouragement: 'tell me your secrets' });

  const addition = yield to_client('add these please my friend', { a, b });
  const biz_stuff = addition + 10;

  const multiplication = yield to_client('now multiply these ones', { a, b: biz_stuff });
  to_client('proud of yourself?', { you_said: multiplication });
};
