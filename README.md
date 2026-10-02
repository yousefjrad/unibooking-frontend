# UniBooking Frontend
React + TypeScript + Vite + Tailwind CSS 4 + react-i18next + React Query + Axios.

## التشغيل
1. `npm install`
2. انسخ `.env.example` إلى `.env.local` وضع عنوان الباك اند (القيمة الافتراضية `https://localhost:7022/api`).
3. شغّل الباك اند ثم `npm run dev` (المنفذ 5173 مطلوب لأن الـ CORS يسمح به فقط).
4. افتح `https://localhost:7022/swagger` في المتصفح مرة واحدة وقبلها (HTTPS للتطوير).

## ملاحظات على الباك اند (تؤثر على الفرونت)
- **خطر أمني:** `AuthService.RegisterAsync` يعطي كل مستخدم جديد `Role = UserRole.Admin`. غيّره إلى `UserRole.Student`، وأنشئ المشرف يدويًا أو عبر Seed.
- `BookingController.GetMyBookings`: أضف `await` قبل `GetMyBookingAsync(...)`.
- `BookingService.GetMyBookingAsync`: ترتيب الباراميترات معكوس؛ `BookingDto` يتوقع `UserFullName` ثم `ResourceName`، والكود يمرر العكس، فيظهر اسم المستخدم مكان اسم القاعة. بدّل `b.Resource.Name` و`userFullName`.
- `Update` و`Delete` في `ResourcesController`: اسم الباراميتر `ResourceId` لا يطابق `{id}`. الفرونت يرسله أيضًا في الـ query كحل مؤقت؛ الأفضل تغييره إلى `Guid id`.
- الحجز الجديد يُنشأ بحالة `Pending` ولا يوجد endpoint للتأكيد، فستبقى الحجوزات قيد الانتظار.
- `UserRole.Instructo` على الأغلب خطأ إملائي (`Instructor`).
- مفتاح الـ JWT الموجود في `appsettings.json` للتطوير فقط؛ انقله إلى `user-secrets` قبل رفعه على GitHub.

## التخصيص الخليجي
RTL افتراضي مع زر تبديل، خط Cairo، التاريخ الميلادي والهجري (أم القرى)، تنبيه عطلة الجمعة/السبت (`src/lib/format.ts`).
