export const TimeoutPromiser = (() => {
  return () => {
    let ids: NodeJS.Timeout[] = [];

    const init = () => {
      ids = [];
    };
    const add = (id: NodeJS.Timeout) => {
      ids.push(id);
    };

    return {
      TimeoutIdManager: {
        clearIds() {
          ids.forEach((id, index) => {
            clearTimeout(id);
          });

          init();
          return ids;
        },
      },

      setStateTimeout: (
        [state, setState]: [state: any, setState: Function],
        delay?: number
      ) => {
        let duration = delay === undefined ? 0 : delay;
        return new Promise((resolve) => {
          const timeOutId = setTimeout(() => {
            resolve(setState(state));
          }, duration);

          add(timeOutId);
        });
      },
    };
  };
})();
