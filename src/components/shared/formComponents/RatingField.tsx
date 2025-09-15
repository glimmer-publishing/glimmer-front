import { useFormikContext } from "formik";
import { Rating } from "react-simple-star-rating";
import StarEmptyIcon from "../icons/StarEmptyIcon";
import StarFilledIcon from "../icons/StarFilledIcon";

interface Values {
  [fieldName: string]: number;
}

export default function RatingField() {
  const { setFieldValue, values, touched, errors } = useFormikContext<Values>();

  return (
    <div>
      <p className="mb-3">Вибери кількість зірок</p>
      <Rating
        initialValue={values.rating}
        onClick={(rate) => setFieldValue("rating", rate)}
        emptyIcon={
          <StarEmptyIcon className="inline-block mx-0.5 w-4 lg:w-6 h-auto" />
        }
        fillIcon={
          <StarFilledIcon className="inline mx-0.5 w-4 lg:w-6 h-auto" />
        }
      />
      {touched.rating && errors.rating && (
        <p className="absolute bottom-[-11px] left-2 text-[9px] font-normal leading-none text-red-500">
          {errors.rating}
        </p>
      )}
    </div>
  );
}
