const GRPC = Symbol('Application#grpc');

module.exports = {
  get grpc() {
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
    if (!this[GRPC]) {
      // 实际情况肯定更复杂
      this[GRPC] = {}
    }
    return this[GRPC];
  },
};