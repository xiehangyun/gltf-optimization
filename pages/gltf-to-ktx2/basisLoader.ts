let basisEncoder: any = null;

export function initBasis() {
  return new Promise((resolve) => {
    if (basisEncoder) return resolve(basisEncoder);
    const scriptSrc = '/basis/encoder/basis_encoder.js';

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.onload = () => {
      // @ts-ignore
      BASIS({
        onRuntimeInitialized: () => {},
      }).then((module: any) => {
        basisEncoder = module;
        resolve(basisEncoder);
        if (module.initializeBasis) {
          module.initializeBasis();
          console.log('module.initializeBasis() called successfully.');
        } else {
          console.error('module.initializeBasis() is not available on the Module object.');
        }
      });
    };

    script.onerror = () => {
      console.error('Failed to load the Basis module.');
    };

    document.head.appendChild(script);
  });
}
