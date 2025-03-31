// import Agent from "@/components/Agent";

import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.actions";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3>Interview generation</h3>

      <Agent
        userName="YOUR_USERNAME"
        userId="YOUR_USER_ID"
        // profileImage={user?.profileURL}
        type="generate"
      />
    </>
  );
};

export default Page;
