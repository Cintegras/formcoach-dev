
# 🔗 INTEGRATION_PROMPTS.md
Prompts for connecting external tools (e.g., Supabase, GitHub, Stripe).

## Supabase Integration Prompts

Use these prompts to set up and configure Supabase for FormCoach:

```
Set up Supabase integration for FormCoach with these requirements:
- Authentication: [email/social/passwordless]
- Database tables: [users/workouts/exercises/logs/etc.]
- Storage needs: [profile images/workout media/etc.]
- Row-level security: [access rules for different user types]

Include:
1. Schema design with relationships
2. RLS policies for data security
3. Authentication flow integration
4. API client configuration
```

## Payment Integration Prompts

Use these prompts to integrate payment processing:

```
Implement [Stripe/PayPal/etc.] payment processing for FormCoach with:
- Product types: [subscriptions/one-time purchases/etc.]
- Pricing tiers: [free/basic/premium]
- Checkout flow: [redirect/embedded/popup]
- Webhook handling: [subscription events/payment success/failure]

Include:
1. User-facing payment UI
2. Server-side payment handling
3. Subscription management
4. Error handling and recovery
```

## Third-Party API Integration Prompts

Use these prompts to integrate external services:

```
Integrate [service name] API with FormCoach for [purpose]:
- Authentication: [API keys/OAuth/etc.]
- Data exchange: [what data is being sent/received]
- User flow: [how users interact with the integration]
- Error handling: [how to handle API failures]

Include:
1. API client configuration
2. Data transformation logic
3. UI components for the integration
4. Fallback mechanisms
```

## Analytics Integration Prompts

Use these prompts to implement analytics tracking:

```
Implement [analytics platform] for FormCoach with these tracking needs:
- User events: [signups/logins/feature usage]
- Conversion goals: [subscription/workout completion/etc.]
- Custom dimensions: [user properties to track]
- Reporting needs: [what insights are needed]

Include:
1. Analytics initialization
2. Event tracking implementation
3. User property tracking
4. Privacy considerations
```

## Implementation Example

When implementing integrations based on these prompts:

```tsx
// Example Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication hook
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  return { session, loading };
}
```
