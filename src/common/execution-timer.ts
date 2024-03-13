export class ExecutionTimer {
  public startTime = new Date().valueOf();
  diff() {
    return new Date().valueOf() - this.startTime;
  }
}
