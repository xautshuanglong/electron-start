#include <napi.h>

Napi::String Method3(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Hello world 3");
}

class HelloAddon : public Napi::Addon<HelloAddon> {
  public:
  HelloAddon(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "hello3"), Napi::Function::New(env, Method3));
    DefineAddon(exports, {InstanceMethod("hello4", &HelloAddon::Hello, napi_enumerable)});
  }

  private:
  Napi::Value Hello(const Napi::CallbackInfo& info) {
    return Napi::String::New(info.Env(), "Hello world 4");
  }
};

NODE_API_ADDON(HelloAddon)
