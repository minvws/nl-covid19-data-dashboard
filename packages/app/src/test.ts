import { defineMessages, defineMessage } from 'react-intl';

function foo(name: string) {
  const msg = defineMessage({
    defaultMessage: 'Foo bar ' + name,
    description: 'Foo desc ' + name,
  });
  return msg.defaultMessage;
}

console.log(foo('Arjan'));
console.log(foo('Martier'));
console.log(foo('Norriz'));

defineMessage({
  defaultMessage: 'Foo bar kmewk',
  description: 'Foo bar lols',
});
