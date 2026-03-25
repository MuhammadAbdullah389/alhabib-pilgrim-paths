-- In-app chat between applicants and admins

CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('user', 'admin')),
  message_text TEXT NOT NULL CHECK (length(trim(message_text)) > 0),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_last_message_at
  ON public.chat_conversations(last_message_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_created
  ON public.chat_messages(conversation_id, created_at ASC);

CREATE OR REPLACE FUNCTION public.touch_chat_conversation_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_conversations
  SET
    updated_at = now(),
    last_message_at = now()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_touch_chat_conversation_activity ON public.chat_messages;
CREATE TRIGGER trg_touch_chat_conversation_activity
AFTER INSERT ON public.chat_messages
FOR EACH ROW
EXECUTE FUNCTION public.touch_chat_conversation_activity();

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Chat conversation policies
DROP POLICY IF EXISTS "Users can view own chat conversation" ON public.chat_conversations;
CREATE POLICY "Users can view own chat conversation"
ON public.chat_conversations
FOR SELECT
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own chat conversation" ON public.chat_conversations;
CREATE POLICY "Users can create own chat conversation"
ON public.chat_conversations
FOR INSERT
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own chat conversation" ON public.chat_conversations;
CREATE POLICY "Users can update own chat conversation"
ON public.chat_conversations
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all chat conversations" ON public.chat_conversations;
CREATE POLICY "Admins can view all chat conversations"
ON public.chat_conversations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can create chat conversations" ON public.chat_conversations;
CREATE POLICY "Admins can create chat conversations"
ON public.chat_conversations
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

DROP POLICY IF EXISTS "Admins can update chat conversations" ON public.chat_conversations;
CREATE POLICY "Admins can update chat conversations"
ON public.chat_conversations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Chat message policies
DROP POLICY IF EXISTS "Participants can view chat messages" ON public.chat_messages;
CREATE POLICY "Participants can view chat messages"
ON public.chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.chat_conversations c
    WHERE c.id = chat_messages.conversation_id
      AND (
        c.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.role = 'admin'
        )
      )
  )
);

DROP POLICY IF EXISTS "Users can send own chat messages" ON public.chat_messages;
CREATE POLICY "Users can send own chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND sender_role = 'user'
  AND EXISTS (
    SELECT 1
    FROM public.chat_conversations c
    WHERE c.id = chat_messages.conversation_id
      AND c.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Admins can send chat messages" ON public.chat_messages;
CREATE POLICY "Admins can send chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND sender_role = 'admin'
  AND EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
);

DROP POLICY IF EXISTS "Participants can update chat messages" ON public.chat_messages;
CREATE POLICY "Participants can update chat messages"
ON public.chat_messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.chat_conversations c
    WHERE c.id = chat_messages.conversation_id
      AND (
        c.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.role = 'admin'
        )
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.chat_conversations c
    WHERE c.id = chat_messages.conversation_id
      AND (
        c.user_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.profiles p
          WHERE p.id = auth.uid() AND p.role = 'admin'
        )
      )
  )
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_rel pr
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_publication p ON p.oid = pr.prpubid
    WHERE p.pubname = 'supabase_realtime'
      AND n.nspname = 'public'
      AND c.relname = 'chat_conversations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_rel pr
    JOIN pg_class c ON c.oid = pr.prrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_publication p ON p.oid = pr.prpubid
    WHERE p.pubname = 'supabase_realtime'
      AND n.nspname = 'public'
      AND c.relname = 'chat_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
END $$;
