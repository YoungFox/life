# life

目前思路是在底层Timer中定时走秒，并且更新Row中的state
因为Row中onLeftButtonPress不好控制，但是它在触发时能读到当前的state
此时，再更新Life组件的state，从而实现了计时页与首页时间同步的功能