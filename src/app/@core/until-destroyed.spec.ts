import { OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { untilDestroyed } from './until-destroyed';

function createObserver() {
  return {
    next: jasmine.createSpy(),
    error: jasmine.createSpy(),
    complete: jasmine.createSpy()
  };
}

describe('untilDestroyed', () => {
  it('should not destroy other instances', () => {
    // Arrange
    const spy = createObserver();
    const spy2 = createObserver();

    class Test implements OnDestroy {
      public obs!: Subscription;

      public ngOnDestroy() {}

      public subscribe(cb: any) {
        this.obs = new Subject().pipe(untilDestroyed(this)).subscribe(cb);
      }
    }

    // Act
    const component1 = new Test();
    const component2 = new Test();
    component1.subscribe(spy);
    component2.subscribe(spy2);
    component1.ngOnDestroy();

    // Assert
    expect(spy.complete).toHaveBeenCalledTimes(1);
    expect(spy2.complete).not.toHaveBeenCalled();
    component2.ngOnDestroy();
    expect(spy2.complete).toHaveBeenCalledTimes(1);
  });

  it('should work with multiple observables', () => {
    // Arrange
    const spy = createObserver();
    const spy2 = createObserver();
    const spy3 = createObserver();

    class Test implements OnDestroy {
      public obs = new Subject().pipe(untilDestroyed(this)).subscribe(spy);
      public obs2 = new Subject().pipe(untilDestroyed(this)).subscribe(spy2);
      public obs3 = new Subject().pipe(untilDestroyed(this)).subscribe(spy3);

      public ngOnDestroy() {}
    }

    // Act
    const instance = new Test();
    instance.ngOnDestroy();

    // Assert
    expect(spy.complete).toHaveBeenCalledTimes(1);
    expect(spy2.complete).toHaveBeenCalledTimes(1);
    expect(spy3.complete).toHaveBeenCalledTimes(1);
  });

  it('should work with classes that are not components', () => {
    // Arrange
    const spy = createObserver();

    // Act
    class Test {
      public obs = new Subject().pipe(untilDestroyed(this, 'destroy')).subscribe(spy);

      public destroy() {}
    }

    // Assert
    const instance = new Test();
    instance.destroy();
    expect(spy.complete).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe from anywhere', () => {
    // Arrange
    const spy = createObserver();
    const spy2 = createObserver();
    const spy3 = createObserver();

    class LoginComponent implements OnInit, OnDestroy {
      public dummy = new Subject().pipe(untilDestroyed(this)).subscribe(spy);

      public constructor() {
        new Subject().pipe(untilDestroyed(this)).subscribe(spy2);
      }

      public ngOnInit() {
        new Subject().pipe(untilDestroyed(this)).subscribe(spy3);
      }

      public ngOnDestroy() {}
    }

    // Act
    const instance = new LoginComponent();
    instance.ngOnInit();
    instance.ngOnDestroy();

    // Assert
    expect(spy.complete).toHaveBeenCalledTimes(1);
    expect(spy2.complete).toHaveBeenCalledTimes(1);
    expect(spy3.complete).toHaveBeenCalledTimes(1);
  });

  it('should throw when destroy method doesnt exist', () => {
    // Arrange
    const spy = createObserver();

    class LoginComponent {
      public dummy = new Subject().pipe(untilDestroyed(this)).subscribe(spy);
    }

    // Assert
    expect(() => new LoginComponent()).toThrow();
  });

  it('should not throw when destroy method is implemented on super class', () => {
    // Arrange
    const spy = createObserver();

    class A implements OnDestroy {
      public ngOnDestroy() {}
    }

    class B extends A {
      public dummy = new Subject().pipe(untilDestroyed(this)).subscribe(spy);
    }

    // Assert
    expect(() => new B()).not.toThrow();
  });

  it('should work with subclass', () => {
    // Arrange
    const spy = createObserver();

    class Parent implements OnDestroy {
      public ngOnDestroy() {}
    }

    class Child extends Parent {
      public obs = new Subject().pipe(untilDestroyed(this)).subscribe(spy);

      public constructor() {
        super();
      }
    }

    // Assert
    const instance = new Child();
    instance.ngOnDestroy();
    expect(spy.complete).toHaveBeenCalledTimes(1);
  });
});
