#include <napi.h>

Napi::String SayHello1(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "Hello world node addon api");
}

Napi::Value Add1(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 2) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsNumber() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  double arg0 = info[0].As<Napi::Number>().DoubleValue();
  double arg1 = info[1].As<Napi::Number>().DoubleValue();
  Napi::Number num = Napi::Number::New(env, arg0 + arg1);

  return num;
}

class HelloAddon : public Napi::Addon<HelloAddon> {
  public:
  HelloAddon(Napi::Env env, Napi::Object exports) {
    exports.Set(Napi::String::New(env, "sayHello1"), Napi::Function::New(env, SayHello1));
    exports.Set(Napi::String::New(env, "add1"), Napi::Function::New(env, Add1));
    DefineAddon(exports, {InstanceMethod("sayHello2", &HelloAddon::SayHello2, napi_enumerable)});
    DefineAddon(exports, {InstanceMethod("add2", &HelloAddon::Add2, napi_enumerable)});
  }

  private:
  Napi::Value SayHello2(const Napi::CallbackInfo& info) {
    return Napi::String::New(info.Env(), "Hello world node addon class");
  }

  Napi::Value Add2(const Napi::CallbackInfo& info) {
    Napi::Env env = info.Env();

    if (info.Length() < 2) {
      Napi::TypeError::New(env, "Wrong number of arguments")
          .ThrowAsJavaScriptException();
      return env.Null();
    }

    if (!info[0].IsNumber() || !info[1].IsNumber()) {
      Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
      return env.Null();
    }
  
    int arg0 = info[0].As<Napi::Number>().Int32Value();
    int arg1 = info[1].As<Napi::Number>().Int32Value();
    Napi::Number sum = Napi::Number::New(env, arg0 + arg1);

    return sum;
  }
};

NODE_API_ADDON(HelloAddon)
